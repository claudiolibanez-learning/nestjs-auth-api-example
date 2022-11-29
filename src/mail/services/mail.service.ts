import { Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import handlebars from 'handlebars';
import { readFile } from 'node:fs/promises';

interface ITemplateVariables {
  [key: string]: string | number;
}

interface IParseMailTemplate {
  file: string;
  variables: ITemplateVariables;
}

interface IMailContact {
  name: string;
  email: string;
}

export default interface ISendMail {
  to: IMailContact;
  from?: IMailContact;
  subject: string;
  templateData: IParseMailTemplate;
}

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  private async parse({ file, variables }: IParseMailTemplate) {
    const templateFileContent = await readFile(file, {
      encoding: 'utf-8',
    });

    const parseTemplate = handlebars.compile(templateFileContent);
    return parseTemplate(variables);
  }

  public async sendMail({
    to,
    subject,
    from,
    templateData,
  }: ISendMail): Promise<void> {
    await this.mailerService.sendMail({
      to: { name: to.name, address: to.email },
      from: {
        name: from?.name || process.env.MAIL_NAME,
        address: from?.email || process.env.MAIL_ADDRESS,
      },
      subject,
      html: await this.parse(templateData),
    });
  }
}
