import { Controller, Get, Post, Render, Req, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';


import { Request, Response } from 'express';


@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,

  ) { }


  @Get()
  getHomePage(@Req() req: Request, @Res() res: Response) {
    const isAuthenticated = req.isAuthenticated();
    return res.render('home', { isAuthenticated })
  }

  @Get('/login')
  async getLoginPage(@Req() req: Request, @Res() res: Response) {
    const isAuthenticated = req.isAuthenticated();
    if (isAuthenticated) {
      return res.redirect("/");
    }
    else return res.render('login')
  }


  @Render('user')
  @Get('/user')
  async getUserPage() {


  }

  //tham khảo: https://www.loginradius.com/blog/engineering/guest-post/session-authentication-with-nestjs-and-mongodb/
  //https://www.loginradius.com/blog/engineering/guest-post/session-authentication-with-nestjs-and-mongodb/


  @Post('/login')
  async handleLoginStateful(@Req() req: Request, @Res() res: Response) {
    return res.redirect("/")
  }

  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    /* destroys user session */
    req.session.destroy(function (err) {
      if (err) console.log(err)
      return res.redirect("/")
    });

  }
}
