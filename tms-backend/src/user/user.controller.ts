import {
  Controller,
  Get,
  Body,
  Param,
  // ParseIntPipe,
  Post,
  Delete,
  UseGuards,
  Put,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUserAdmin, GetUserServices, GetUser } from '../auth/decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @Get('all')
  @ApiResponse({
    status: 200,
    description: 'Se han obtenido los usuarios exitosamente.',
    type: User,
    isArray: true,
  })
  async getAll(@GetUserAdmin() user: User) {
    return this.userService.findAll();
  }

  @HttpCode(HttpStatus.OK)
  @Post('/adduser')
  async addUser(user: User, @Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/adduser/out')
  async addUserOut(user: User, @Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/adduser/prestatario')
  async addUserPrestatario(
    @GetUserAdmin() user: User,
    @Body() dto: CreateUserDto,
  ) {
    // opcional: aquí podrías verificar que dto.role corresponde al rol "prestatario"
    return this.userService.createUser(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/:userId')
  async getUserById(
    @GetUserAdmin() user: User,
    @Param('userId') userId: string,
  ) {
    return this.userService.findOneById(userId);
  }

  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @Put('edit/:userId')
  async editUser(
    @GetUser() user: User,
    @Param('userId') userId: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.editUser(userId, dto);
  }

  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('delete/:userId')
  async deleteUser(
    @GetUserAdmin() user: User,
    @Param('userId') userId: string,
  ) {
    return this.userService.deleteUser(userId);
  }
}
