import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// controllers
import { UsersController } from './controllers/users.controller';

// services
import { UsersService } from './services/users.service';

// repositories
import { UsersRepository } from './repositories/users.repository';

// entities
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
