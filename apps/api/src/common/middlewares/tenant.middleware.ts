import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    const tenantId =
      (req.headers['x-tenant-id'] as string) ||
      this.extractSubdomain(req.hostname);

    if (tenantId) {
      const tenant = await this.prisma.tenant.findFirst({
        where: {
          OR: [{ id: tenantId }, { domain: tenantId }],
        },
      });

      if (tenant) {
        (req as any).tenantId = tenant.id;
        (req as any).tenant = tenant;
      }
    }

    next();
  }

  private extractSubdomain(hostname: string): string | null {
    const parts = hostname.split('.');
    if (parts.length > 2) {
      return parts[0];
    }
    return null;
  }
}
