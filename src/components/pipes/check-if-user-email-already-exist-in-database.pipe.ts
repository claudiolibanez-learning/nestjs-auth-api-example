import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

// dtos
import { CreateUserDto } from '../../users/dtos/create-user.dto';

// services
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class CheckIfUserEmailAlreadyExistInDatabasePipe
  implements PipeTransform<CreateUserDto>
{
  constructor(readonly usersService: UsersService) {}

  async transform(value: CreateUserDto, metadata: ArgumentMetadata) {
    const userAlreadyExists = await this.usersService.findOneByEmail(
      value.email,
    );

    if (userAlreadyExists) {
      throw new BadRequestException('User already exists');
    }

    return value;
  }
}
