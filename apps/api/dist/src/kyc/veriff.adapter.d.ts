import { AppConfigService } from '../common/config/config.service';
import { KycProvider } from './kyc.service';
export declare class VeriffAdapter implements KycProvider {
    private configService;
    private readonly logger;
    private readonly apiKey;
    private readonly baseUrl;
    constructor(configService: AppConfigService);
    initiateVerification(data: {
        userId: string;
        email: string;
        firstName: string;
        lastName: string;
        dateOfBirth: string;
        country: string;
    }): Promise<{
        verificationUrl: string;
        verificationId: string;
    }>;
    getVerificationStatus(verificationId: string): Promise<{
        status: string;
        data: any;
    }>;
    handleCallback(payload: any): Promise<{
        userId: string;
        status: string;
    }>;
}
