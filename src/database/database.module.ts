import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// configs
import { dataSourceOptions } from './config/typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions)],
})
export class DatabaseModule {}
