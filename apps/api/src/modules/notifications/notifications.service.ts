import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  async sendWhatsApp(phone: string, message: string): Promise<void> {
    // Mocked WhatsApp notification — replace with real API integration later
    this.logger.log(`[WhatsApp → ${phone}] ${message}`);
  }

  async notifyOrderCreated(orderId: string, customerName: string): Promise<void> {
    await this.sendWhatsApp(
      'store-owner',
      `New order #${orderId.slice(0, 8)} from ${customerName}`,
    );
  }
}
