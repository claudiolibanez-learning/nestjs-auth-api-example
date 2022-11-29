import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

// helpers
import { MessagesHelper } from '../../helpers/messages.helpers';

// services
import { AuthService } from '../services/auth.service';

// entities
import { User } from '../../users/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<User> {
    const user = await this.authService.validateUser({ email, password });

    // if (user.deletedAt) {
    //   throw new NotFoundException(MessagesHelper.USER_NOT_FOUND);
    // }

    if (!user) {
      throw new UnauthorizedException({
        message: MessagesHelper.EMAIL_OR_PASSWORD_INVALID,
      });
    }

    return user;
  }
}
