import { IsEmail } from 'class-validator';   // cho email
import { IsString } from 'class-validator';  // cho password, token

export class ResetPasswordDto {
    @IsString()
    token: string;

    @IsString()
    newPassword: string;
}
