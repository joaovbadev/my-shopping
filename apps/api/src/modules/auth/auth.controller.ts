import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { CurrentTenant } from '../../common/decorators/tenant.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto, @CurrentTenant() tenantId: string) {
    if (!tenantId) {
      throw new BadRequestException('Tenant not resolved. Provide x-tenant-id header.');
    }
    return this.authService.login(dto, tenantId);
  }

  @Post('register')
  async register(@Body() dto: RegisterDto, @CurrentTenant() tenantId: string) {
    if (!tenantId) {
      throw new BadRequestException('Tenant not resolved. Provide x-tenant-id header.');
    }
    return this.authService.register(dto, tenantId);
  }
}
