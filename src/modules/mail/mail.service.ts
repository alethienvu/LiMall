import { MailerService } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { getConfig } from 'src/configs';
import { TestMailDto } from 'src/modules/mail/dto/test-mail.dto';
import { mailConfig } from 'src/configs/mail.config';
import { MailProcessor } from './mail.processor';

@Injectable()
export class MailService {
  public static MAIL_DOMAIN = getConfig().get<string>('mail.domain');
  public static MAIL_PREFIX = 'MAIL_CACHE_';
  public static MAIL_TTL = 1800; // 30 minutes

  public static WAIT_PREFIX = 'MAIL_WAIT_';
  public static WAIT_TTL = 60; // 1 minutes

  constructor(@InjectQueue('mail') private readonly emailQueue: Queue, private mailerService: MailerService) {}

  async sendMail(email: string, subject: string, body: string): Promise<void> {
    await this.mailerService.sendMail({
      from: mailConfig.from,
      to: email,
      subject: subject,
      template: 'src/modules/mail/templates/test-email.hbs',
      context: {
        email: email,
        content: body,
        bannerLink: MailProcessor.MAIL_BANNER_LINK,
      },
    });
  }

  async sendTestEmail(email: string, subject: string, content: string): Promise<void> {
    const testMailDto: TestMailDto = { email, subject, content };
    await this.emailQueue.add('sendTestMail', {
      ...testMailDto,
    });
  }
}
