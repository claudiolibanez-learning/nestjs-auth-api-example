import { Module } from '@nestjs/common';

// modules
import { UsersModule } from '../users/users.module';
import { TokensModule } from '../tokens/tokens.module';
import { MailModule } from '../mail/mail.module';
import { RolesModule } from '../roles/roles.module';

// strategies
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

// constrollers
import { AuthController } from './controllers/auth.controller';

// services
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    // modules
    UsersModule,
    RolesModule,
    TokensModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [
    // services
    AuthService,

    // Strategies
    LocalStrategy,
    JwtStrategy,

    // serializers
    // SessionSerializer,

    // Guards
    // RoleGuard,
  ],
})
export class AuthModule {}
