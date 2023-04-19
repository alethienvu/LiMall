import { Injectable, Logger } from '@nestjs/common';
import { Command, Console } from 'nestjs-console';
import { MailService } from 'src/modules/mail/mail.service';

@Console()
@Injectable()
export class MailConsole {
  constructor(private readonly mailService: MailService, private readonly logger: Logger) {
    this.logger.setContext(MailConsole.name);
  }

  @Command({
    command: 'email:send <email> <subject> <body>',
    description: 'Send test email',
  })
  async sendMail(email: string, subject: string, body: string): Promise<void> {
    await this.mailService.sendMail(email, subject, body);
  }

  @Command({
    command: 'email:send-via-queue <email> <subject> <body>',
    description: 'Send test email via queue',
  })
  async sendMailViaQueue(email: string, subject: string, body: string): Promise<void> {
    await this.mailService.sendTestEmail(email, subject, body);
  }
}
