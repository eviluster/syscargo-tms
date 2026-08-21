import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDefaultAereoToPrestatarioXXXXXXXXXXXX
  implements MigrationInterface
{
  name = 'AddDefaultAereoToPrestatarioXXXXXXXXXXXX';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "prestatario"
      ADD COLUMN "default_aereo" boolean NOT NULL DEFAULT false
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "prestatario"
      DROP COLUMN "default_aereo"
    `);
  }
}