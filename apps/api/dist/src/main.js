"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const helmet_1 = __importDefault(require("helmet"));
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
const nestjs_pino_1 = require("nestjs-pino");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bufferLogs: true,
    });
    const configService = app.get(config_1.ConfigService);
    const logger = app.get(nestjs_pino_1.Logger);
    app.use((0, helmet_1.default)());
    app.enableCors({
        origin: process.env.NODE_ENV === 'production'
            ? [configService.get('FRONTEND_URL', 'http://localhost:3000')]
            : true,
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Deedify API')
        .setDescription('Tokenized raw-land fractional ownership platform API')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('auth', 'Authentication endpoints')
        .addTag('users', 'User management')
        .addTag('listings', 'Land listing management')
        .addTag('nfts', 'NFT and collection management')
        .addTag('marketplace', 'Trading and marketplace operations')
        .addTag('votes', 'Governance and voting')
        .addTag('payouts', 'Revenue distribution')
        .addTag('webhooks', 'External service webhooks')
        .addTag('kyc', 'Know Your Customer verification')
        .addTag('storage', 'File storage and management')
        .addTag('valuation', 'Property valuation services')
        .addTag('health', 'Health checks and monitoring')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
    app.use((req, res, next) => {
        const rateLimit = require('express-rate-limit');
        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 100,
            message: 'Too many requests from this IP, please try again later.',
        });
        limiter(req, res, next);
    });
    const port = configService.get('PORT', 3000);
    await app.listen(port);
    logger.log(`🚀 Deedify API is running on: http://localhost:${port}`);
    logger.log(`📚 API Documentation: http://localhost:${port}/docs`);
    logger.log(`🏥 Health Check: http://localhost:${port}/health`);
}
bootstrap().catch((error) => {
    console.error('Failed to start application:', error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map