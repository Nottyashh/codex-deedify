import { z } from 'zod';
import { AuthService } from './auth.service';
declare const LoginDto: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email?: string;
    password?: string;
}, {
    email?: string;
    password?: string;
}>;
declare const RegisterDto: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<["INVESTOR", "LISTER"]>>;
    walletAddress: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email?: string;
    role?: "INVESTOR" | "LISTER";
    walletAddress?: string;
    password?: string;
}, {
    email?: string;
    role?: "INVESTOR" | "LISTER";
    walletAddress?: string;
    password?: string;
}>;
declare const UpdateProfileDto: z.ZodObject<{
    walletAddress: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    walletAddress?: string;
}, {
    walletAddress?: string;
}>;
type LoginDto = z.infer<typeof LoginDto>;
type RegisterDto = z.infer<typeof RegisterDto>;
type UpdateProfileDto = z.infer<typeof UpdateProfileDto>;
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        user: {
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
            walletAddress: string;
            kycStatus: import("@prisma/client").$Enums.KycStatus;
            createdAt: Date;
        };
        message: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
            walletAddress: string;
            kycStatus: import("@prisma/client").$Enums.KycStatus;
        };
        accessToken: string;
        tokenType: string;
        expiresIn: string;
    }>;
    getProfile(req: any): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        walletAddress: string;
        kycStatus: import("@prisma/client").$Enums.KycStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(req: any, updateDto: UpdateProfileDto): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        walletAddress: string;
        kycStatus: import("@prisma/client").$Enums.KycStatus;
        updatedAt: Date;
    }>;
    refresh(req: any): Promise<{
        accessToken: string;
        tokenType: string;
        expiresIn: string;
    }>;
    logout(req: any): Promise<{
        message: string;
    }>;
}
export {};
