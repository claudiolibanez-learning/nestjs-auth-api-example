import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

// modules
import { UsersModule } from '../users/users.module';

// services
import { TokensService } from './services/tokens.service';

// repositories
import { TokensRepository } from './repositories/tokens.repository';

// entities
import { Token } from './entities/token.entity';

@Module({
  imports: [
    // modules
    UsersModule,
    TypeOrmModule.forFeature([Token]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [TokensService, TokensRepository],
  exports: [TokensService],
})
export class TokensModule {}
