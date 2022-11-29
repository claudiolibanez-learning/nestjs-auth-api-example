import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignOptions, TokenExpiredError } from 'jsonwebtoken';
import * as moment from 'moment';

// helpers
import { MessagesHelper } from '../../helpers/messages.helpers';

// enums
import { TokenType } from '../../auth/enums/token-type.enum';

// services
import { UsersService } from '../../users/services/users.service';

// repositories
import { TokensRepository } from '../repositories/tokens.repository';

// entities
import { User } from '../../users/entities/user.entity';

interface IRefreshTokenPayload {
  sub: string;
  jti: string;
}

const BASE_OPTIONS: SignOptions = {
  issuer: process.env.ISSUER_URL,
  audience: process.env.AUDIENCE_URL,
};

@Injectable()
export class TokensService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly tokensRepository: TokensRepository,
    private readonly usersService: UsersService,
  ) {}

  private async verifyToken(token: string): Promise<any> {
    try {
      return this.jwtService.verifyAsync(token);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException(MessagesHelper.TOKEN_EXPIRED);
      }

      throw new UnprocessableEntityException(MessagesHelper.TOKEN_MALFORMED);
    }
  }

  private async verifyRefreshToken(
    token: string,
  ): Promise<IRefreshTokenPayload> {
    try {
      return this.jwtService.verifyAsync(token);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnprocessableEntityException(
          MessagesHelper.REFRESH_TOKEN_EXPIRED,
        );
      } else {
        throw new UnprocessableEntityException(
          MessagesHelper.REFRESH_TOKEN_MALFORMED,
        );
      }
    }
  }

  public async verifyEmailConfirmationToken(token: string): Promise<User> {
    const decoded = await this.verifyToken(token);

    const tokenExists = await this.tokensRepository.findOneByToken(
      decoded.jti,
      decoded.sub,
    );

    if (!tokenExists) {
      throw new UnauthorizedException(MessagesHelper.TOKEN_NOT_FOUND);
    }

    const user = await this.usersService.findOne(decoded.sub);

    if (!user) {
      throw new NotFoundException(MessagesHelper.USER_NOT_FOUND);
    }

    return user;
  }

  private async getStoredTokenFromRefreshToken(payload: IRefreshTokenPayload) {
    const tokenId = payload.jti;

    if (!tokenId) {
      throw new UnprocessableEntityException(
        MessagesHelper.REFRESH_TOKEN_MALFORMED,
      );
    }

    return this.tokensRepository.findOne(tokenId);
  }

  private async getUserFromRefreshTokenPayload(
    payload: IRefreshTokenPayload,
  ): Promise<User> {
    const subId = payload.sub;

    if (!subId) {
      throw new UnprocessableEntityException(
        MessagesHelper.REFRESH_TOKEN_MALFORMED,
      );
    }

    return this.usersService.findOne(subId);
  }

  private async resolveRefreshToken(refreshToken: string): Promise<any> {
    const payload = await this.verifyRefreshToken(refreshToken);

    const token = await this.getStoredTokenFromRefreshToken(payload);

    if (!token) {
      throw new UnprocessableEntityException(
        MessagesHelper.REFRESH_TOKEN_NOT_FOUND,
      );
    }

    if (token.isRevoked) {
      throw new UnprocessableEntityException(MessagesHelper.REFRESH_IS_REVOKED);
    }

    const user = await this.getUserFromRefreshTokenPayload(payload);

    if (!user) {
      throw new UnprocessableEntityException(
        MessagesHelper.REFRESH_TOKEN_MALFORMED,
      );
    }

    return {
      user,
      token,
    };
  }

  private async generateToken(
    user: User,
    signOptions?: SignOptions,
  ): Promise<string> {
    const payload = {
      // role: user.role.name,
      roles: user.roles.map((role) => role.name),
    };

    const opts: SignOptions = {
      ...BASE_OPTIONS,
      subject: String(user.id),
      ...signOptions,
    };

    return this.jwtService.signAsync(payload, opts);
  }

  public async generateRefreshToken(user: User): Promise<any> {
    const expiresIn = '30d';

    const expiresAt = moment().add(30, 'day').toDate();

    await this.deleteAllTokensByType(user.id, TokenType.REFRESH_TOKEN);

    const token = await this.tokensRepository.create({
      userId: user.id,
      type: TokenType.REFRESH_TOKEN,
      expiresAt,
    });

    return this.generateToken(user, {
      expiresIn,
      jwtid: token.id,
    });
  }

  public async generateEmailConfirmationToken(user: User): Promise<string> {
    const expiresAt = moment().add(1, 'day').toDate();

    const token = await this.tokensRepository.create({
      userId: user.id,
      type: TokenType.EMAIL_CONFIRMATION,
      expiresAt,
    });

    return this.generateToken(user, {
      jwtid: token.id,
    });
  }

  public async generateForgotPasswordToken(user: User): Promise<string> {
    const expiresAt = moment().add(1, 'day').toDate();

    const token = await this.tokensRepository.create({
      userId: user.id,
      type: TokenType.FORGOT_PASSWORD,
      expiresAt,
    });

    return this.generateToken(user, {
      jwtid: token.id,
    });
  }

  public async createAccessToken(user: User): Promise<string> {
    return this.generateToken(user);
  }

  public async createRefreshToken(user: User): Promise<any> {
    return this.generateRefreshToken(user);
  }

  public async createTokensFromRefreshToken(
    refreshToken: string,
  ): Promise<any> {
    const { user } = await this.resolveRefreshToken(refreshToken);

    const access_token = await this.generateToken(user);

    const refresh_token = await this.generateRefreshToken(user);

    return {
      user,
      access_token,
      refresh_token,
    };
  }

  public async deleteAllTokensByType(userId: string, type: string) {
    await this.tokensRepository.deleteAllTokensByType(userId, type);
  }
}
