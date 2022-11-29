import { PartialType } from '@nestjs/mapped-types';

// dtos
import { CreateRoleDto } from './create-role.dto';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
