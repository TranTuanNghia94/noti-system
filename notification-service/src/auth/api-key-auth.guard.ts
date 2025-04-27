import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Inject } from '@nestjs/common';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
      this.logger.error('API key is missing', { context: ApiKeyAuthGuard.name, function: this.canActivate.name });
      throw new UnauthorizedException('API key is missing');
    }

    const validApiKey = this.configService.get<string>('API_KEY');

    if (apiKey !== validApiKey) {
      this.logger.error('Invalid API key', { context: ApiKeyAuthGuard.name, function: this.canActivate.name });
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
} 