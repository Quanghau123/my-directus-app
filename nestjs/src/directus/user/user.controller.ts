import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('login')
  showLoginForm(@Res() res: Response) {
    res.render('user/login');
  }

  @Post('login')
  async login(@Body() body: LoginUserDto, @Res() res: Response) {
    const result = await this.userService.login(body);
    if (!result) {
      return res.status(401).send('Sai email hoặc mật khẩu.');
    }

    return res.send(`Xin chào ${result.user['email']}, đăng nhập thành công!`);
  }
}
