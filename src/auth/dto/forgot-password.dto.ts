import { IsEmail } from 'class-validator';   // cho email
import { IsString } from 'class-validator';  // cho password, token

export class ForgotPasswordDto {
    @IsEmail()
    email: string;
}
