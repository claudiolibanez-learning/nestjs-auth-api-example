import 'dotenv/config';

import * as path from 'node:path';
import { DataSource, DataSourceOptions } from 'typeorm';

const entities = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'dist',
  '**',
  '*.entity{.ts,.js}',
);

// const entitiesDir = path.join(
//   __dirname,
//   '..',
//   '..',
//   '..',
//   'dist',
//   '**',
//   'entities',
// );

const migrations = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'dist',
  'database',
  'migrations',
  '*{.ts,.js}',
);

const migrationsDir = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'dist',
  'database',
  'migrations',
);

export const dataSourceOptions: DataSourceOptions = {
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: Number(process.env.TYPEORM_PORT),
  database: process.env.TYPEORM_DATABASE,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  entities: [entities],
  // migrationsTableName: 'migrations',
  migrations: [migrations],
  cli: {
    // entitiesDir,
    migrationsDir,
  },
  synchronize: false,
  logger: 'simple-console',
} as DataSourceOptions;

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
