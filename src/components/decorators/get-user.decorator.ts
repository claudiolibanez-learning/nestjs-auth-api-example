import { createParamDecorator } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';

export const GetUser = createParamDecorator((data, request) => {
  return request.user;
});
