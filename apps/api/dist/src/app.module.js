"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const bullmq_1 = require("@nestjs/bullmq");
const nestjs_pino_1 = require("nestjs-pino");
const prisma_module_1 = require("./common/prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const listings_module_1 = require("./listings/listings.module");
const nfts_module_1 = require("./nfts/nfts.module");
const marketplace_module_1 = require("./marketplace/marketplace.module");
const votes_module_1 = require("./votes/votes.module");
const payouts_module_1 = require("./payouts/payouts.module");
const webhooks_module_1 = require("./webhooks/webhooks.module");
const kyc_module_1 = require("./kyc/kyc.module");
const storage_module_1 = require("./storage/storage.module");
const valuation_module_1 = require("./valuation/valuation.module");
const health_module_1 = require("./health/health.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env.local', '.env'],
            }),
            nestjs_pino_1.LoggerModule.forRoot({
                pinoHttp: {
                    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
                    transport: process.env.NODE_ENV === 'production'
                        ? undefined
                        : {
                            target: 'pino-pretty',
                            options: {
                                colorize: true,
                                translateTime: 'SYS:standard',
                                ignore: 'pid,hostname',
                            },
                        },
                    serializers: {
                        req: (req) => ({
                            method: req.method,
                            url: req.url,
                            headers: {
                                'user-agent': req.headers['user-agent'],
                                'content-type': req.headers['content-type'],
                            },
                        }),
                        res: (res) => ({
                            statusCode: res.statusCode,
                        }),
                    },
                },
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            bullmq_1.BullModule.forRoot({
                connection: {
                    host: process.env.REDIS_HOST || 'localhost',
                    port: parseInt(process.env.REDIS_PORT || '6379'),
                    password: process.env.REDIS_PASSWORD,
                },
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            listings_module_1.ListingsModule,
            nfts_module_1.NftsModule,
            marketplace_module_1.MarketplaceModule,
            votes_module_1.VotesModule,
            payouts_module_1.PayoutsModule,
            webhooks_module_1.WebhooksModule,
            kyc_module_1.KycModule,
            storage_module_1.StorageModule,
            valuation_module_1.ValuationModule,
            health_module_1.HealthModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map