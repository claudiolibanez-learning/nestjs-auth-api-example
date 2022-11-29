import { PartialType } from '@nestjs/mapped-types';

// dtos
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
