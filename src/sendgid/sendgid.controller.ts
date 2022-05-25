import { Controller, Post } from '@nestjs/common';
import { SendgidService } from './sendgid.service';

@Controller('api/sendgid')
export class SendgidController {
  constructor(private readonly sendgridService: SendgidService) {}

  @Post('send')
  async sendEmail() {
    const mail = {
      from: 'michalus88@gmail.com',
      to: 'mich4lus88@gmail.com',
      subject: 'Test',
      text: 'Działa',
    };

    return await this.sendgridService.send(mail);
  }
}
