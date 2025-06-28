import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { User } from '../users/user.schema';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService, // <-- Thêm dòng này
    ) { }

    async signup(dto: SignupDto) {
        const hashed = await bcrypt.hash(dto.password, 10);

        const user = await this.usersService.create({
            email: dto.email,
            username: dto.username,
            password: hashed,
        });

        return { message: 'User created successfully', user };
    }

    async signin(dto: SigninDto) {
        const user = await this.usersService.findByEmailWithPermissions(dto.email);
        if (!user) {
            throw new UnauthorizedException('Email not found');
        }

        const isMatch = await bcrypt.compare(dto.password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid password');
        }

        // 🔍 THÊM 2 DÒNG NÀY NGAY ĐÂY
        console.log('roleGroup:', user.roleGroup);
        console.log('permissions:', user.roleGroup?.permissions?.map((p: any) => p.name));

        const payload = {
            sub: user._id,
            email: user.email,
            permissions: user.roleGroup?.permissions?.map((p: any) => p.name),
        };

        const token = this.jwtService.sign(payload);

        return {
            access_token: token,
            user: {
                email: user.email,
                roleGroup: user.roleGroup?.name,
                permissions: user.roleGroup?.permissions?.map((p: any) => p.name),
            },
        };
    }
    async forgotPassword(dto: ForgotPasswordDto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user) throw new NotFoundException('User not found');

        const token = randomUUID(); // hoặc dùng nanoid
        user.resetToken = token;
        user.resetTokenExpires = new Date(Date.now() + 1000 * 60 * 15); // 15 phút

        await (user as any).save();

        console.log(`🔑 Reset Token: ${token}`);

        return { message: 'Reset token sent to email (console)' };
    }

    async resetPassword(dto: ResetPasswordDto) {
        const user = await this.usersService.findByResetToken(dto.token);
        if (!user || user.resetTokenExpires < new Date()) {
            throw new BadRequestException('Token invalid or expired');
        }

        user.password = await bcrypt.hash(dto.newPassword, 10);
        user.resetToken = undefined;
        user.resetTokenExpires = undefined;

        await user.save();

        return { message: 'Password reset successful' };
    }


}
