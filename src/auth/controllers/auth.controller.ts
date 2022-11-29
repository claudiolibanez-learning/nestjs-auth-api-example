import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';

// decorators
// import { GetUser } from '../../components/decorators/get-user.decorator';
import { Roles } from '../decorators/roles.decorator';

// enums
import { Role } from '../enums/role.enum';

// pipes
import { CheckIfUserEmailAlreadyExistInDatabasePipe } from '../../components/pipes/check-if-user-email-already-exist-in-database.pipe';

// guards
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

// dtos
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { SingInDto } from '../dtos/sign-in.dto';
import { SignUpDto } from '../dtos/sign-up.dto';

// services
import { AuthService } from '../services/auth.service';
import { MailService } from '../../mail/services/mail.service';

// entities
import { User } from '../../users/entities/user.entity';

export interface ISignIn {
  user: User;
}

export interface IAuthenticationPayload {
  user: Record<string, any>;
  access_token: string;
  refresh_token?: string;
}

interface IResponse {
  status: string;
  data?: IAuthenticationPayload;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}

  @Post('signup')
  @UsePipes(CheckIfUserEmailAlreadyExistInDatabasePipe)
  async signup(@Body() body: SignUpDto): Promise<IResponse> {
    const { user, access_token, refresh_token } = await this.authService.signup(
      body,
    );

    // await this.authService.sendConfirmationEmail(user);

    const payload = this.buildResponsePayload(
      user,
      access_token,
      refresh_token,
    );

    return {
      status: 'success',
      data: payload,
    };
  }

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  async signin(@Request() request: SingInDto): Promise<IResponse> {
    const { user, access_token, refresh_token } = await this.authService.signin(
      request.user,
    );

    const payload = this.buildResponsePayload(
      user,
      access_token,
      refresh_token,
    );

    return {
      status: 'success',
      data: payload,
    };
  }

  @Post('confirm-email')
  async confirm(@Query('token') token: string): Promise<IResponse> {
    await this.authService.confirmEmail(token);

    return {
      status: 'success',
    };
  }

  @Post('refresh-token')
  async refresh(
    @Body()
    body: RefreshTokenDto,
  ): Promise<IResponse> {
    const { user, access_token, refresh_token } =
      await this.authService.refresh(body.refresh_token);

    const payload = this.buildResponsePayload(
      user,
      access_token,
      refresh_token,
    );

    return {
      status: 'success',
      data: payload,
    };
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body(new ValidationPipe()) forgotPasswordDto: ForgotPasswordDto,
  ): Promise<IResponse> {
    const user = await this.authService.forgotPassword(forgotPasswordDto);

    await this.authService.sendForgotPasswordEmail(user);

    return {
      status: 'success',
    };
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Request() request: { user: { id: string } },
    @Body(new ValidationPipe()) changePasswordDto: ChangePasswordDto,
  ): Promise<IResponse> {
    await this.authService.changePassword(request.user.id, changePasswordDto);

    return {
      status: 'success',
    };
  }

  @Delete('deactivate')
  @UseGuards(JwtAuthGuard)
  async deactivate(
    @Request() request: { user: { id: string } },
  ): Promise<IResponse> {
    await this.authService.deactivate(request.user.id);

    return {
      status: 'success',
    };
  }

  private buildResponsePayload(
    user: User,
    access_token: string,
    refresh_token?: string,
  ): IAuthenticationPayload {
    return {
      user: instanceToPlain(user),
      access_token,
      ...(refresh_token ? { refresh_token } : {}),
    };
  }

  @Get('protected')
  @Roles(Role.ADMIN)
  @UseGuards(
    JwtAuthGuard,
    // RoleGuard
    RolesGuard,
  )
  public getRouteProtected(): string {
    return 'Route protected';
  }

  // @Get('email')
  // public async emailTest(): Promise<void> {
  //   const emailConfirmationTemplate = resolve(
  //     __dirname,
  //     '..',
  //     'templates',
  //     'email-confirmation.template.hbs',
  //   );

  //   await this.mailService.sendMail({
  //     to: {
  //       name: 'Claudio',
  //       email: 'claudiolibanezdev@gmail.com',
  //     },
  //     subject: 'Test email',
  //     templateData: {
  //       file: emailConfirmationTemplate,
  //       variables: {
  //         name: 'Claudio',
  //         link: 'http://localhost:3000',
  //       },
  //     },
  //   });
  // }
}
