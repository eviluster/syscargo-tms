import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import logger from '../logging/winston.config';

@Injectable()
export class TaskService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyMigration() {
    logger.info('Running daily database migration task');
    try {
      // Ejecutar migraciones pendientes
      await this.dataSource.runMigrations();
      logger.info('Daily migration completed successfully');
    } catch (error) {
      logger.error('Daily migration failed', error);
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async handleHourlyCleanup() {
    logger.info('Running hourly cleanup task');
    try {
      // Lógica de limpieza de datos temporales o caché
      // Este es un placeholder para tareas de mantenimiento
      logger.info('Hourly cleanup completed successfully');
    } catch (error) {
      logger.error('Hourly cleanup failed', error);
    }
  }

  @Cron('0 0 * * 0') // Cada domingo a medianoche
  async handleWeeklyBackup() {
    logger.info('Running weekly backup task');
    try {
      // Lógica de backup semanal
      // Este es un placeholder para tareas de backup
      logger.info('Weekly backup completed successfully');
    } catch (error) {
      logger.error('Weekly backup failed', error);
    }
  }
}