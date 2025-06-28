import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { randomUUID } from 'crypto'; // Thêm import này nếu chưa có
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    signup(@Body() dto: SignupDto) {
        return this.authService.signup(dto);
    }

    @Post('signin')
    signin(@Body() dto: SigninDto) {
        return this.authService.signin(dto);
    }

    @Post('forgot-password')
    forgot(@Body() dto: ForgotPasswordDto) {
        return this.authService.forgotPassword(dto);
    }

    @Post('reset-password')
    reset(@Body() dto: ResetPasswordDto) {
        return this.authService.resetPassword(dto);
    }
}
