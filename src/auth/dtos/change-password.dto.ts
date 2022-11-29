import { IsNotEmpty, IsString, Matches } from 'class-validator';

// helpers
import { RegExHelper } from '../../helpers/regex.helper';
import { MessagesHelper } from '../../helpers/messages.helpers';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @Matches(RegExHelper.password, {
    message: MessagesHelper.WEAK_PASSWORD,
  })
  readonly password: string;
}
