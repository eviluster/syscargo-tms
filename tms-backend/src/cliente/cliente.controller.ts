// src/clients/client.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ClientService } from './cliente.service';
import { CreateClientDto } from './dto/create-cliente.dto';
import { UpdateClientDto } from './dto/update-cliente.dto';
import { JwtGuard } from 'src/auth/guard';

import { GetUser } from 'src/auth/decorator';
import { User } from 'src/user/entities/user.entity';

@ApiBearerAuth()
@ApiTags('Cliente')
@Controller('cliente')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  // ADMIN: crear cliente (en nombre de un user) - recibe userId dentro del body o se puede ampliar
  //@UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAsAdmin(@Body() dto: CreateClientDto & { userId?: string }) {
    // Si el admin proporciona userId, el service debe asignarlo.
    // Aquí delegamos la lógica al service.
    return this.clientService.create(
      dto as CreateClientDto,
      (dto as any).userId,
    );
  }

  // Usuario autenticado crea su perfil cliente (si no existe)
  //@UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Post('me')
  @HttpCode(HttpStatus.CREATED)
  async createForMe(@GetUser() user: User, @Body() dto: CreateClientDto) {
    return this.clientService.createFromUser(dto, user);
  }

  // ADMIN: obtener todos los clients
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Get('all')
  async findAll() {
    return this.clientService.findAll();
  }

  // Obtener el client asociado al usuario autenticado
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Get('me')
  async findMy(@GetUser() user: User) {
    return this.clientService.findByUserId(user.id);
  }

  // Obtener client por id (admin)
  //@UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.clientService.findOne(id);
  }

  // Obtener client por userId (ruta compatible con frontend)
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Get('user/:userId')
  async findByUser(@GetUser() user: User, @Param('userId') userId: string) {
    // permiso: admin puede ver cualquier client; el propio usuario puede ver su client
    const isAdmin = user.role?.name?.toLowerCase?.() === 'administrador';
    if (!isAdmin && user.id !== userId) {
      // delegar control fino al service (o lanzar Forbidden). Aquí lanzamos Forbidden indirectamente.
      // Si prefieres, puedes permitir al service manejar el check.
      throw new Error('No autorizado');
    }
    return this.clientService.findByUserId(userId);
  }

  // Actualizar client: admin o owner (service debe validar owner/admin)
  //@UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Put(':id')
  async update(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateClientDto,
  ) {
    return this.clientService.update(id, dto, user);
  }

  // Eliminar client: admin o owner (service valida permisos)
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@GetUser() user: User, @Param('id') id: string) {
    return this.clientService.remove(id, user);
  }
}
