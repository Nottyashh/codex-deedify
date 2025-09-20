"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftService = void 0;
exports.createNftService = createNftService;
const umi_bundle_defaults_1 = require("@metaplex-foundation/umi-bundle-defaults");
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const umi_uploader_bundled_uploader_1 = require("@metaplex-foundation/umi-uploader-bundled-uploader");
class NftService {
    constructor(configService, mintAuthority) {
        this.configService = configService;
        this.mintAuthority = mintAuthority;
        this.umi = (0, umi_bundle_defaults_1.createUmi)(this.configService.heliusRpcUrl)
            .use((0, umi_bundle_defaults_1.keypairIdentity)(this.mintAuthority))
            .use((0, umi_uploader_bundled_uploader_1.bundledUploader)())
            .use((0, mpl_token_metadata_1.mplTokenMetadata)());
    }
    async createCollectionNft(listingId, metadata) {
        const mint = (0, umi_bundle_defaults_1.generateSigner)(this.umi);
        const metadataPda = (0, mpl_token_metadata_1.findMetadataPda)(this.umi, { mint: mint.publicKey });
        const masterEditionPda = (0, mpl_token_metadata_1.findMasterEditionPda)(this.umi, { mint: mint.publicKey });
        const metadataUri = await this.umi.uploader.uploadJson(metadata);
        await (0, mpl_token_metadata_1.createCollectionNft)(this.umi, {
            mint,
            name: metadata.name,
            symbol: 'DEEDIFY',
            uri: metadataUri,
            sellerFeeBasisPoints: (0, umi_bundle_defaults_1.percentAmount)(2.5),
            isMutable: true,
        }).sendAndConfirm(this.umi);
        return {
            mint: mint.publicKey,
            metadataPda,
        };
    }
    async createFractionalNfts(listingId, collectionMint, totalShares, baseMetadata) {
        const results = [];
        for (let i = 1; i <= totalShares; i++) {
            const mint = (0, umi_bundle_defaults_1.generateSigner)(this.umi);
            const metadataPda = (0, mpl_token_metadata_1.findMetadataPda)(this.umi, { mint: mint.publicKey });
            const shareMetadata = {
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
            const metadataUri = await this.umi.uploader.uploadJson(shareMetadata);
            await (0, mpl_token_metadata_1.createNft)(this.umi, {
                mint,
                name: shareMetadata.name,
                symbol: 'DEEDIFY',
                uri: metadataUri,
                sellerFeeBasisPoints: (0, umi_bundle_defaults_1.percentAmount)(2.5),
                isMutable: true,
                collection: {
                    key: collectionMint,
                    verified: false,
                },
            }).sendAndConfirm(this.umi);
            results.push({
                mint: mint.publicKey,
                metadataPda,
                index: i,
            });
        }
        return results;
    }
    async updateNftMetadata(mint, metadata) {
        const metadataPda = (0, mpl_token_metadata_1.findMetadataPda)(this.umi, { mint });
        const metadataUri = await this.umi.uploader.uploadJson(metadata);
        await (0, mpl_token_metadata_1.updateV1)(this.umi, {
            mint,
            data: {
                name: metadata.name,
                symbol: metadata.symbol,
                uri: metadataUri,
                sellerFeeBasisPoints: metadata.sellerFeeBasisPoints,
            },
        }).sendAndConfirm(this.umi);
        return metadataUri;
    }
    async fetchNftMetadata(mint) {
        try {
            const nft = await (0, mpl_token_metadata_1.fetchNft)(this.umi, mint);
            return nft;
        }
        catch (error) {
            console.error('Failed to fetch NFT metadata:', error);
            return null;
        }
    }
    async fetchCollectionMetadata(collectionMint) {
        try {
            const collection = await (0, mpl_token_metadata_1.fetchCollection)(this.umi, collectionMint);
            return collection;
        }
        catch (error) {
            console.error('Failed to fetch collection metadata:', error);
            return null;
        }
    }
    async verifyCollectionAuthority(collectionMint, authority) {
        try {
            const collection = await (0, mpl_token_metadata_1.fetchCollection)(this.umi, collectionMint);
            return collection.updateAuthority === authority;
        }
        catch (error) {
            console.error('Failed to verify collection authority:', error);
            return false;
        }
    }
    getMetadataPda(mint) {
        return (0, mpl_token_metadata_1.findMetadataPda)(this.umi, { mint }).publicKey;
    }
    getMasterEditionPda(mint) {
        return (0, mpl_token_metadata_1.findMasterEditionPda)(this.umi, { mint }).publicKey;
    }
    getCollectionAuthorityRecordPda(collectionMint, authority) {
        return (0, mpl_token_metadata_1.findCollectionAuthorityRecordPda)(this.umi, {
            mint: collectionMint,
            collectionAuthority: authority,
        }).publicKey;
    }
}
exports.NftService = NftService;
function createNftService(configService, mintAuthority) {
    return new NftService(configService, mintAuthority);
}
//# sourceMappingURL=nft.js.map