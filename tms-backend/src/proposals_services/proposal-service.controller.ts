// src/proposals_services/proposals-services.controller.ts
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
import { ProposalsServicesService } from './proposal-service.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateProposalServiceDto } from './dto/create-proposal-service.dto';
import { UpdateProposalServiceStatusDto } from './dto/update-proposal-service-status.dto';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller()
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class ProposalsServicesController {
  constructor(
    private readonly proposalsServicesService: ProposalsServicesService,
  ) {}

  // crear proposal asociada a una solicitud
  @Post('solicitudes/:solicitudId/proposals_services')
  async createForSolicitud(
    @Param('solicitudId') solicitudId: string,
    @Body() dto: CreateProposalServiceDto,
    @GetUser() user: User,
  ) {
    return this.proposalsServicesService.create(solicitudId, dto, user);
  }

  // crear proposal directa (sin solicitud)
  @Post('proposals_services')
  async createDirect(
    @Body() dto: CreateProposalServiceDto,
    @GetUser() user: User,
  ) {
    return this.proposalsServicesService.create(undefined, dto, user);
  }

  @Get('proposals_services')
  async list(
    @GetUser() user: User,
    @Query('solicitudId') solicitudId?: string,
    @Query('prestatarioId') prestatarioId?: string,
    @Query('status') status?: string,
    @Query('serviceType') serviceType?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const filters: any = {};
    if (solicitudId) filters.solicitudId = solicitudId;
    if (prestatarioId) filters.prestatarioId = prestatarioId;
    if (status) filters.status = status;
    if (serviceType) filters.serviceType = serviceType;
    if (limit) filters.limit = Number(limit);
    if (offset) filters.offset = Number(offset);
    return this.proposalsServicesService.listForUser(user, filters);
  }

  @Get('proposals_services/:id')
  async getOne(@Param('id') id: string) {
    return this.proposalsServicesService.getOne(id);
  }

  @Put('proposals_services/:id/status')
  @Patch('proposals_services/:id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateProposalServiceStatusDto,
    @GetUser() user: User,
  ) {
    return this.proposalsServicesService.updateStatus(id, dto, user);
  }

  @Post('proposals_services/:id/accept')
  async accept(@Param('id') id: string, @GetUser() user: User) {
    const dto: UpdateProposalServiceStatusDto = { status: 'accepted' };
    return this.proposalsServicesService.updateStatus(id, dto, user);
  }

  @Post('proposals_services/:id/reject')
  async reject(@Param('id') id: string, @GetUser() user: User) {
    const dto: UpdateProposalServiceStatusDto = { status: 'rejected' };
    return this.proposalsServicesService.updateStatus(id, dto, user);
  }

  @Post('proposals_services/:id/cancel')
  async cancel(@Param('id') id: string, @GetUser() user: User) {
    const dto: UpdateProposalServiceStatusDto = { status: 'cancelled' };
    return this.proposalsServicesService.updateStatus(id, dto, user);
  }

  @Post('proposals_services/:id/confirm')
  async confirmAssignment(@Param('id') id: string, @GetUser() user: User) {
    return this.proposalsServicesService.confirmAssignment(id, user);
  }

  @Post('proposals_services/:id/carta-generated')
  async markCartaGenerated(@Param('id') id: string, @GetUser() user: User) {
    return this.proposalsServicesService.markCartaGenerated(id, user);
  }
}
