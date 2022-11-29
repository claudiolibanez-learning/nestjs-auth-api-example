export class CreateTokenDto {
  readonly userId: string;
  readonly type: string;
  readonly expiresAt: Date;
}
