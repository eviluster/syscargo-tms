import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  BadRequestException,
  Req,
  Res,
  // UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthDto } from './dto/auth.dto';
import { GetUser, GetUserAdmin } from './decorator';
import { User } from 'src/user/entities/user.entity';
import { TokenDto } from './dto/token.dto';
import { LogOutDto } from './dto/logOut.dto';
import { LoginDto } from './dto/login.dto';
import { JwtGuard } from './guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Request, Response } from 'express';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/reset-password.dto';

// import { GetUserAdmin } from './decorator';
// import { JwtGuard } from './guard';
// import { User } from '../user/entities/user.entity';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authSetvice: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  signup(@Body() dto: CreateUserDto) {
    return this.authSetvice.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signup-admin')
  signupAdmin(@Body() dto: CreateUserDto) {
    return this.authSetvice.signupAdmin(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  @ApiOperation({ summary: 'Autentica el usuario' })
  signin(@Body() dto: AuthDto) {
    return this.authSetvice.login(dto);
  }

  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @Post('log-out')
  @ApiOperation({ summary: 'Cierra sesión' })
  signOut(@GetUser() user: LogOutDto) {
    console.log('User controller', user);
    const dto = new LogOutDto();
    console.log(dto);
    dto.id = user.id;
    return this.authSetvice.logOut(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('is-token-expired')
  @ApiOperation({ summary: 'Valida el token' })
  isTokenExpired(@Body() dto: TokenDto) {
    return this.authSetvice.isTokenExpired(dto);
  }

  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logged-out')
  @ApiOperation({ summary: 'Cierra sesión' })
  loggedAdmin(@Body() dto: LogOutDto, @GetUserAdmin() user: User) {
    return this.authSetvice.loggedOut(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('forgot_password')
  @ApiOperation({ summary: 'Solicita restablecimiento de contraseña' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authSetvice.forgotPassword(dto.email);
    return { message: 'Si existe una cuenta con este correo, se ha enviado un enlace para restablecer la contraseña.' };
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset_password')
  @ApiOperation({ summary: 'Restablece la contraseña' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authSetvice.resetPassword(dto.token, dto.email, dto.password, dto.password_confirmation);
    return { message: 'Contraseña restablecida exitosamente.' };
  }
}
