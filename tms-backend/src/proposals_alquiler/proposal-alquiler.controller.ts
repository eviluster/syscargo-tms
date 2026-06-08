// src/proposals_alquiler/proposal-alquiler.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  Param,
  Patch,
  Put,
} from '@nestjs/common';
import { ProposalsAlquilerService } from './proposal-alquiler.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateProposalAlquilerDto } from './dto/create-proposal-alquiler.dto';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { UpdateProposalAlquilerStatusDto } from './dto/update-proposal-alquiler-status.dto';

@Controller()
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class ProposalsAlquilerController {
  constructor(
    private readonly proposalsAlquilerService: ProposalsAlquilerService,
  ) {}

  @Post('solicitudes/:solicitudId/proposals_alquiler')
  async create(
    @Param('solicitudId') solicitudId: string,
    @Body() dto: CreateProposalAlquilerDto,
    @GetUser() user: User,
  ) {
    // normalizamos dto shape: prestatarioId -> prestatario_id if needed inside service
    return this.proposalsAlquilerService.create(solicitudId, dto, user);
  }

  @Get('proposals_alquiler')
  async list(
    @GetUser() user: User,
    @Query('solicitudId') solicitudId?: string,
    @Query('prestatarioId') prestatarioId?: string,
    @Query('status') status?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const filters: any = {};
    if (solicitudId) filters.solicitudId = solicitudId;
    if (prestatarioId) filters.prestatarioId = prestatarioId;
    if (status) filters.status = status;
    if (limit) filters.limit = Number(limit);
    if (offset) filters.offset = Number(offset);
    return this.proposalsAlquilerService.listForUser(user, filters);
  }

  @Get('proposals_alquiler/:id')
  async getOne(@Param('id') id: string) {
    return this.proposalsAlquilerService.getOne(id);
  }

  @Put('proposals_alquiler/:id/status')
  @Patch('proposals_alquiler/:id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateProposalAlquilerStatusDto,
    @GetUser() user: User,
  ) {
    return this.proposalsAlquilerService.updateStatus(id, dto, user);
  }

  @Post('proposals_alquiler/:id/accept')
  async accept(@Param('id') id: string, @GetUser() user: User) {
    const dto: UpdateProposalAlquilerStatusDto = { status: 'accepted' };
    return this.proposalsAlquilerService.updateStatus(id, dto, user);
  }

  @Post('proposals_alquiler/:id/reject')
  async reject(@Param('id') id: string, @GetUser() user: User) {
    const dto: UpdateProposalAlquilerStatusDto = { status: 'rejected' };
    return this.proposalsAlquilerService.updateStatus(id, dto, user);
  }

  @Post('proposals_alquiler/:id/cancel')
  async cancel(@Param('id') id: string, @GetUser() user: User) {
    const dto: UpdateProposalAlquilerStatusDto = { status: 'cancelled' };
    return this.proposalsAlquilerService.updateStatus(id, dto, user);
  }

  @Post('proposals_alquiler/:id/confirm')
  async confirmAssignment(@Param('id') id: string, @GetUser() user: User) {
    return this.proposalsAlquilerService.confirmAssignment(id, user);
  }

  @Post('proposals_alquiler/:id/carta-generated')
  async markCartaGenerated(@Param('id') id: string, @GetUser() user: User) {
    return this.proposalsAlquilerService.markCartaGenerated(id, user);
  }
}
