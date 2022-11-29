import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
// import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
// import { join } from 'path';

// services
import { MailService } from './services/mail.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        // port: Number(process.env.MAIL_PORT) || 443,
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      // template: {
      //   dir: join(__dirname, '..', '**', 'templates'),
      //   adapter: new HandlebarsAdapter(),
      // },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
