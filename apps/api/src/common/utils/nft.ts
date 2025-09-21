import { PublicKey, Keypair } from '@solana/web3.js';
import { createUmi as createConfiguredUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  generateSigner,
  keypairIdentity,
  percentAmount,
  publicKey as umiPublicKey,
  type Pda,
  type PublicKey as UmiPublicKey,
  type Umi,
} from '@metaplex-foundation/umi';
import {
  createNft,
  findMetadataPda,
  findMasterEditionPda,
  findCollectionAuthorityRecordPda,
  mplTokenMetadata,
  updateV1,
  fetchDigitalAsset,
} from '@metaplex-foundation/mpl-token-metadata';
import { bundlrUploader } from '@metaplex-foundation/umi-uploader-bundlr';
import { AppConfigService } from '../config/config.service';

export interface NftMetadata {
  name: string;
  description: string;
  symbol?: string;
  image?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
  properties?: {
    files?: Array<{
      uri: string;
      type: string;
    }>;
    category?: string;
  };
  // Deedify-specific fields
  parcelSize?: number;
  coordinatePolicy?: boolean;
  coordinatePolicyNote?: string;
  listingId?: string;
  shareIndex?: number;
  totalShares?: number;
  sellerFeeBasisPoints?: number;
}

export class NftService {
  private umi: Umi;

  constructor(
    private configService: AppConfigService,
    private mintAuthority: Keypair
  ) {
    this.umi = createConfiguredUmi(this.configService.heliusRpcUrl)
      .use(
        keypairIdentity({
          publicKey: this.toUmiPublicKey(this.mintAuthority.publicKey),
          secretKey: new Uint8Array(this.mintAuthority.secretKey),
        })
      )
      .use(bundlrUploader())
      .use(mplTokenMetadata());
  }

  private toUmiPublicKey(key: PublicKey | string): UmiPublicKey {
    return typeof key === 'string' ? umiPublicKey(key) : umiPublicKey(key.toBase58());
  }

  private toWeb3PublicKey(key: UmiPublicKey | Pda): PublicKey {
    const address = Array.isArray(key) ? key[0] : key;
    return new PublicKey(address);
  }

  /**
   * Create a collection NFT for a land listing
   */
  async createCollectionNft(
    listingId: string,
    metadata: NftMetadata
  ): Promise<{ mint: PublicKey; metadataPda: PublicKey }> {
    const mint = generateSigner(this.umi);
    const metadataPda = findMetadataPda(this.umi, { mint: mint.publicKey });
    findMasterEditionPda(this.umi, { mint: mint.publicKey });

    // Upload metadata to IPFS
    const metadataUri = await this.umi.uploader.uploadJson(metadata);

    await createNft(this.umi, {
      mint,
      name: metadata.name,
      symbol: metadata.symbol ?? 'DEEDIFY',
      uri: metadataUri,
      sellerFeeBasisPoints: percentAmount(metadata.sellerFeeBasisPoints ?? 2.5),
      isMutable: true,
      isCollection: true,
    }).sendAndConfirm(this.umi);

    return {
      mint: new PublicKey(mint.publicKey),
      metadataPda: this.toWeb3PublicKey(metadataPda),
    };
  }

  /**
   * Create fractional NFTs for a listing
   */
  async createFractionalNfts(
    listingId: string,
    collectionMint: PublicKey,
    totalShares: number,
    baseMetadata: NftMetadata
  ): Promise<Array<{ mint: PublicKey; metadataPda: PublicKey; index: number }>> {
    const results = [];

    for (let i = 1; i <= totalShares; i++) {
      const mint = generateSigner(this.umi);
      const metadataPda = findMetadataPda(this.umi, { mint: mint.publicKey });

      // Create metadata for this specific share
      const shareMetadata: NftMetadata = {
        ...baseMetadata,
        name: `${baseMetadata.name} - Share ${i}`,
        shareIndex: i,
        totalShares,
        attributes: [
          ...(baseMetadata.attributes || []),
          { trait_type: 'Share Number', value: i },
          { trait_type: 'Total Shares', value: totalShares },
          { trait_type: 'Listing ID', value: listingId },
        ],
      };

      // Upload metadata
      const metadataUri = await this.umi.uploader.uploadJson(shareMetadata);

      // Create the NFT
      await createNft(this.umi, {
        mint,
        name: shareMetadata.name,
        symbol: shareMetadata.symbol ?? baseMetadata.symbol ?? 'DEEDIFY',
        uri: metadataUri,
        sellerFeeBasisPoints: percentAmount(
          shareMetadata.sellerFeeBasisPoints ?? baseMetadata.sellerFeeBasisPoints ?? 2.5
        ),
        isMutable: true,
        collection: {
          key: this.toUmiPublicKey(collectionMint),
          verified: false, // Will be verified later
        },
      }).sendAndConfirm(this.umi);

      results.push({
        mint: new PublicKey(mint.publicKey),
        metadataPda: this.toWeb3PublicKey(metadataPda),
        index: i,
      });
    }

    return results;
  }

  /**
   * Update NFT metadata
   */
  async updateNftMetadata(
    mint: PublicKey,
    metadata: Partial<NftMetadata>
  ): Promise<string> {
    const umiMint = this.toUmiPublicKey(mint);
    const metadataPda = findMetadataPda(this.umi, { mint: umiMint });
    const existing = await fetchDigitalAsset(this.umi, umiMint);

    // Upload updated metadata
    const metadataUri = await this.umi.uploader.uploadJson(metadata);

    // Update the NFT
    await updateV1(this.umi, {
      mint: umiMint,
      metadata: metadataPda,
      data: {
        __option: 'Some',
        value: {
          name: metadata.name ?? existing.metadata.name,
          symbol: metadata.symbol ?? existing.metadata.symbol,
          uri: metadataUri,
          sellerFeeBasisPoints:
            metadata.sellerFeeBasisPoints ?? existing.metadata.sellerFeeBasisPoints,
          creators: existing.metadata.creators,
        },
      },
    }).sendAndConfirm(this.umi);

    return metadataUri;
  }

  /**
   * Fetch NFT metadata
   */
  async fetchNftMetadata(mint: PublicKey): Promise<any> {
    try {
      return await fetchDigitalAsset(this.umi, this.toUmiPublicKey(mint));
    } catch (error) {
      console.error('Failed to fetch NFT metadata:', error);
      return null;
    }
  }

  /**
   * Fetch collection metadata
   */
  async fetchCollectionMetadata(collectionMint: PublicKey): Promise<any> {
    try {
      return await fetchDigitalAsset(this.umi, this.toUmiPublicKey(collectionMint));
    } catch (error) {
      console.error('Failed to fetch collection metadata:', error);
      return null;
    }
  }

  /**
   * Verify collection authority
   */
  async verifyCollectionAuthority(
    collectionMint: PublicKey,
    authority: PublicKey
  ): Promise<boolean> {
    try {
      const collection = await fetchDigitalAsset(
        this.umi,
        this.toUmiPublicKey(collectionMint)
      );
      return new PublicKey(collection.metadata.updateAuthority).equals(authority);
    } catch (error) {
      console.error('Failed to verify collection authority:', error);
      return false;
    }
  }

  /**
   * Get metadata PDA for a mint
   */
  getMetadataPda(mint: PublicKey): PublicKey {
    const pda = findMetadataPda(this.umi, { mint: this.toUmiPublicKey(mint) });
    return this.toWeb3PublicKey(pda);
  }

  /**
   * Get master edition PDA for a mint
   */
  getMasterEditionPda(mint: PublicKey): PublicKey {
    const pda = findMasterEditionPda(this.umi, { mint: this.toUmiPublicKey(mint) });
    return this.toWeb3PublicKey(pda);
  }

  /**
   * Get collection authority record PDA
   */
  getCollectionAuthorityRecordPda(
    collectionMint: PublicKey,
    authority: PublicKey
  ): PublicKey {
    const pda = findCollectionAuthorityRecordPda(this.umi, {
      mint: this.toUmiPublicKey(collectionMint),
      collectionAuthority: this.toUmiPublicKey(authority),
    });
    return this.toWeb3PublicKey(pda);
  }
}

/**
 * Factory function to create NFT service
 */
export function createNftService(
  configService: AppConfigService,
  mintAuthority: Keypair
): NftService {
  return new NftService(configService, mintAuthority);
}