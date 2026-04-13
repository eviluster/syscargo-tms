// src/notifications/notifications.controller.ts
import {
  Controller,
  Get,
  UseGuards,
  Req,
  Post,
  Param,
  Body,
  Delete,
  Put,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator/get-user.decorator';

@Controller('notification')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(JwtGuard)
  @Get()
  async myNotifications(@GetUser() user: any) {
    return this.notificationsService.listForUser(user.id, false);
  }

  @UseGuards(JwtGuard)
  @Get('unread')
  async myUnread(@GetUser() user: any) {
    return this.notificationsService.listForUser(user.id, true);
  }

  @UseGuards(JwtGuard)
  @Post(':id/read')
  async markRead(@Param('id') id: string, @GetUser() user: any) {
    return this.notificationsService.markAsRead(id, user.id);
  }

  @UseGuards(JwtGuard)
  @Post('read-all')
  async markAll(@GetUser() user: any) {
    return this.notificationsService.markAllAsRead(user.id);
  }

  // GET /notifications/all
  @UseGuards(JwtGuard)
  @Get('/all')
  async allForUser(@GetUser() user: any) {
    // Devuelve todas las notificaciones (con destinyUser etc.) para el usuario
    return {
      data: await this.notificationsService.listForUser(user.id, false),
    };
  }

  // POST /notifications/read  body: { notificationId, destinationId?, isReaded? }
  @UseGuards(JwtGuard)
  @Post('/read')
  async postMarkRead(@Body() body: any, @GetUser() user: any) {
    const { notificationId, destinationId, isReaded } = body;
    // si destinationId no se envía, pasamos user.id como fallback
    const dest = destinationId ?? user.id;
    await this.notificationsService.markAsRead(
      notificationId,
      dest,
      !!isReaded,
    );
    return { ok: true };
  }

  // DELETE /notifications/:id  -> eliminar / soft-delete
  @UseGuards(JwtGuard)
  @Delete('/:id')
  async deleteNotification(@Param('id') id: string) {
    await this.notificationsService.deleteNotification(id);
    return { ok: true };
  }

  // PUT /notifications/active  body: { id, active }
  @UseGuards(JwtGuard)
  @Put('/active')
  async setActive(@Body() body: { id: string; active?: boolean }) {
    await this.notificationsService.setActive(body.id, body.active ?? false);
    return { ok: true };
  }
}
