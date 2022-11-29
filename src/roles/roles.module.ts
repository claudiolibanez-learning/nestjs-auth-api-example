import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// controllers
import { RolesController } from './controllers/roles.controller';

// services
import { RolesService } from './services/roles.service';

// repositories
import { RolesRepository } from './repositories/roles.repository';

// entities
import { Role } from './entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RolesController],
  providers: [RolesService, RolesRepository],
  exports: [RolesService],
})
export class RolesModule {}
