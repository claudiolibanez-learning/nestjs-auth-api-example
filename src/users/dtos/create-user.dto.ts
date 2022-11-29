import { IsEmail, IsNotEmpty } from 'class-validator';

// roles
import { Role } from '../../roles/entities/role.entity';

export class CreateUserDto {
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;

  readonly isEmailConfirmed?: boolean;

  readonly roles?: Role[];
}
