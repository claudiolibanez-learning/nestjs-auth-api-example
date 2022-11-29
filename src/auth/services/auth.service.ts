import { BadRequestException, Injectable } from '@nestjs/common';
import { resolve } from 'node:path';

// helpers
import { MessagesHelper } from '../../helpers/messages.helpers';
import {
  compareHashSync,
  generateHashSync,
} from '../../helpers/bcrypt-hash.helper';

// enums
import { Role } from '../enums/role.enum';

// enums
import { TokenType } from '../enums/token-type.enum';

// dtos
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { SignUpDto } from '../dtos/sign-up.dto';

// services
import { UsersService } from '../../users/services/users.service';
import { RolesService } from '../../roles/services/roles.service';
import { TokensService } from '../../tokens/services/tokens.service';
import { MailService } from '../../mail/services/mail.service';

// entities
import { User } from '../../users/entities/user.entity';

interface IValidatePayload {
  email: string;
  password: string;
}

interface IAuthenicatePayload {
  user: User;
  access_token: string;
  refresh_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly tokensService: TokensService,
    private readonly mailService: MailService,
  ) {}

  public async validateUser({
    email,
    password,
  }: IValidatePayload): Promise<User> {
    let user: User;

    try {
      user = await this.usersService.findOneByEmail(email);
    } catch (error) {
      return null;
    }

    const isPasswordValid = compareHashSync(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  public async signup(signUpDto: SignUpDto): Promise<IAuthenicatePayload> {
    try {
      const userAlreadyExists = await this.usersService.findOneByEmail(
        signUpDto.email,
      );

      if (userAlreadyExists) {
        throw new Error(MessagesHelper.USER_ALREADY_EXISTS);
      }

      // const Admin = await this.rolesService.findOneByNameOrFail(Role.ADMIN);

      const user = await this.usersService.create({
        ...signUpDto,
        roles: [],
      });

      const access_token = await this.tokensService.createAccessToken(user);
      const refresh_token = await this.tokensService.createRefreshToken(user);

      return {
        user,
        access_token,
        refresh_token,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  public async signin(user: User): Promise<IAuthenicatePayload> {
    const access_token = await this.tokensService.createAccessToken(user);
    const refresh_token = await this.tokensService.createRefreshToken(user);

    return {
      user,
      access_token,
      refresh_token,
    };
  }

  public async confirmEmail(token: string): Promise<User> {
    const user = await this.tokensService.verifyEmailConfirmationToken(token);

    await this.usersService.update(user.id, {
      isEmailConfirmed: true,
    });

    await this.tokensService.deleteAllTokensByType(
      user.id,
      TokenType.EMAIL_CONFIRMATION,
    );

    return user;
  }

  public async refresh(refresh_token: string): Promise<IAuthenicatePayload> {
    return this.tokensService.createTokensFromRefreshToken(refresh_token);
  }

  public async forgotPassword({ email }: ForgotPasswordDto): Promise<User> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException(MessagesHelper.EMAIL_INVALID);
    }

    if (!user.isVerified) {
      throw new BadRequestException(MessagesHelper.EMAIL_NOT_CONFIRMED);
    }

    await this.tokensService.deleteAllTokensByType(
      user.id,
      TokenType.FORGOT_PASSWORD,
    );

    return user;
  }

  public async changePassword(
    id: string,
    { password }: ChangePasswordDto,
  ): Promise<void> {
    await this.usersService.update(id, {
      password: generateHashSync(password),
    });

    await this.tokensService.deleteAllTokensByType(
      id,
      TokenType.FORGOT_PASSWORD,
    );
  }

  public async deactivate(id: string): Promise<void> {
    await this.usersService.delete(id);
  }

  public async sendConfirmationEmail(user: User): Promise<void> {
    const token = await this.tokensService.generateEmailConfirmationToken(user);

    const link = `${process.env.BASE_URL}/auth/confirm-email?token=${token}`;

    const confirmEmailTemplate = resolve(
      __dirname,
      '..',
      'templates',
      'confirm-email.template.hbs',
    );

    await this.mailService.sendMail({
      to: {
        name: user.username,
        email: user.email,
      },
      subject: 'Confirm email',
      templateData: {
        file: confirmEmailTemplate,
        variables: {
          name: user.username,
          link,
        },
      },
    });
  }

  public async sendForgotPasswordEmail(user: User): Promise<void> {
    const token = await this.tokensService.generateForgotPasswordToken(user);

    const link = `${process.env.BASE_URL}/auth/reset-password?token=${token}`;

    const forgotPasswordTemplate = resolve(
      __dirname,
      '..',
      'templates',
      'forgot-password.template.hbs',
    );

    await this.mailService.sendMail({
      to: {
        name: user.username,
        email: user.email,
      },
      subject: 'Reset password',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.username,
          link,
        },
      },
    });
  }
}
