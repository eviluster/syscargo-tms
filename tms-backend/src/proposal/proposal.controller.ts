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
import { ProposalService } from './proposal.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { UpdateProposalStatusDto } from './dto/update-proposal-status.dto';

@Controller()
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @Post('proposals')
  async create(@Body() dto: CreateProposalDto, @GetUser() user: User) {
    return this.proposalService.create(dto, user);
  }

  // Lista proposals accesibles para el usuario
  @Get('proposals')
  async list(
    @GetUser() user: User,
    @Query('cargaId') cargaId?: string,
    @Query('prestatarioId') prestatarioId?: string,
    @Query('status') status?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const filters: any = {};
    if (cargaId) filters.cargaId = cargaId;
    if (prestatarioId) filters.prestatarioId = prestatarioId;
    if (status) filters.status = status;
    if (limit) filters.limit = Number(limit);
    if (offset) filters.offset = Number(offset);
    return this.proposalService.listForUser(user, filters);
  }

  @Get('proposals/:id')
  async getOne(@Param('id') id: string) {
    return this.proposalService.getOne(id);
  }

  // Cambiar status (general)
  @Put('proposals/:id/status')
  @Patch('proposals/:id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateProposalStatusDto,
    @GetUser() user: User,
  ) {
    return this.proposalService.updateStatus(id, dto, user);
  }

  // Rutas de conveniencia
  @Post('proposals/:id/accept')
  async accept(@Param('id') id: string, @GetUser() user: User) {
    const dto: UpdateProposalStatusDto = { status: 'accepted' };
    return this.proposalService.updateStatus(id, dto, user);
  }

  @Post('proposals/:id/reject')
  async reject(@Param('id') id: string, @GetUser() user: User) {
    const dto: UpdateProposalStatusDto = { status: 'rejected' };
    return this.proposalService.updateStatus(id, dto, user);
  }

  @Post('proposals/:id/cancel')
  async cancel(@Param('id') id: string, @GetUser() user: User) {
    const dto: UpdateProposalStatusDto = { status: 'cancelled' };
    return this.proposalService.updateStatus(id, dto, user);
  }

  @Post('proposals/:id/confirm')
  async confirmAssignment(@Param('id') id: string, @GetUser() user: User) {
    const result = await this.proposalService.confirmAssignment(id, user);
    return result;
  }

  @Post('proposals/:id/carta-generated')
  async markCartaGenerated(@Param('id') id: string, @GetUser() user: User) {
    return this.proposalService.markCartaGenerated(id, user);
  }
}
