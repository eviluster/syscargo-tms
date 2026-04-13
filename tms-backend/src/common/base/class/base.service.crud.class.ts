import { CodeEnum } from 'src/common/enum/code.enum';
import { CrudDto, ReturnDto } from '../dto';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { KindEnum } from 'src/common/enum/kind.enum';
import { ClassValidator } from '../validator/class.validator';
import { ValidateScenarioDto } from '../dto/validate.scenario.dto';
import { ResourceEnum } from '../../enum/resource.enum';
import { fieldsEnum } from 'src/common/enum/fields.enum';
import { BaseDto } from '../dto/base.crud.dto';
import { DeleteDto } from '../dto/delete.dto';
import { SearchManyDto } from '../dto/search.many.dto';
import { ComparisonType } from 'src/common/enum/comparison.type.enum';

import { MethodEnum } from 'src/common/enum/method.enum';
import { RelationTable, SearchingDto } from '../dto/searching.dto';

// Interfaz completa del SearchingDto

export class BaseServiceCRUD<
  TEntity,
  createDto extends BaseDto,
  updateDto extends BaseDto,
> {
  private dto: CrudDto;
  private returnDto: ReturnDto;
  private valid: boolean;
  private queryBuilder: SelectQueryBuilder<TEntity>;

  constructor(repo: Repository<TEntity>) {
    this.dto = new CrudDto();
    this.dto.repo = repo;
    this.returnDto = new ReturnDto();
  }

  async findAllItems(): Promise<ReturnDto> {
    const returnDto = new ReturnDto();
    returnDto.data = await this.dto.repo.find({});
    return returnDto;
  }
  async findActiveItems(): Promise<ReturnDto> {
    const returnDto = new ReturnDto();
    returnDto.data = await this.dto.repo.find({
      where: { isActive: true },
    });
    return returnDto;
  }
  async create(createDto: createDto): Promise<ReturnDto> {
    if (createDto.rules) {
      this.valid = await this._validate(createDto);
    } else {
      this.valid = true;
    }
    if (this.valid) {
      try {
        this.returnDto.data = await this.dto.repo.save(createDto);
      } catch (error) {
        this.returnDto.isSuccess = false;
        this.returnDto.errorMessage = error.message;
        this.returnDto.returnCode = error.code;
      }
    } else {
      this.returnDto.isSuccess = false;
      this.returnDto.returnCode = CodeEnum.BAD_REQUEST;
      this.returnDto.errorMessage = ResourceEnum.ALREADY_EXST;
    }
    return this.returnDto;
  }
  async update(updateDto: updateDto): Promise<ReturnDto> {
    this.dto.id = updateDto.id;
    if (updateDto.rules) {
      this.valid = await this._validate(updateDto);
    } else {
      this.valid = true;
    }
    if (this.valid) {
      try {
        const object = await this.dto.repo.findOne({
          where: {
            id: this.dto.id,
          },
        });
        if (!object) {
          this.returnDto.isSuccess = false;
          this.returnDto.returnCode = CodeEnum.BAD_REQUEST;
          // traducir
          this.returnDto.errorMessage = '';
        } else {
          this.returnDto.data = await this.dto.repo.save(updateDto);
        }
      } catch (error) {
        this.returnDto.isSuccess = false;
        this.returnDto.errorMessage = error.message;
        this.returnDto.returnCode = error.code;
      }
    } else {
      this.returnDto.isSuccess = false;
      this.returnDto.returnCode = CodeEnum.BAD_REQUEST;
      this.returnDto.errorMessage = ResourceEnum.ALREADY_EXST;
    }
    return this.returnDto;
  }

  async remove(deleteDto: DeleteDto): Promise<ReturnDto> {
    this.dto.id = deleteDto.id;
    const item = await this.dto.repo.findOne({
      where: {
        id: this.dto.id,
      },
    });
    if (!item) {
      this.returnDto.isSuccess = false;
      // traducir
      this.returnDto.returnCode = CodeEnum.BAD_REQUEST;
      this.returnDto.errorMessage = `the Item with id ${this.dto.id} do not exist`;
    } else if (item.isUsed == true) {
      this.returnDto.isSuccess = false;
      // traducir
      this.returnDto.returnCode = CodeEnum.BAD_REQUEST;
      this.returnDto.errorMessage = `the Item with id ${this.dto.id} is in use`;
    } else {
      this.returnDto.data = await this.dto.repo.softDelete(this.dto.id);
    }
    return this.returnDto;
  }

  async search(searchDto: SearchManyDto): Promise<ReturnDto> {
    this.queryBuilder = this.dto.repo.createQueryBuilder(
      this.dto.repo.metadata.tableName,
    );

    if (searchDto.queryType == fieldsEnum.ONE) {
      await this.findOne(searchDto);
    } else if (searchDto.queryType == fieldsEnum.ALL) {
      await this.findAll(searchDto);
    }
    return this.returnDto;
  }

  async findOne(searchDto: SearchManyDto) {
    const item = await this.dto.repo.findOne({
      where: {
        id: searchDto.id,
      },
    });
    if (!item) {
      this.returnDto.isSuccess = false;
      // traducir
      this.returnDto.returnCode = CodeEnum.BAD_REQUEST;
    } else {
      this.returnDto.data = [item];
    }
  }

  async findAll(searchDto: SearchManyDto) {
    this.returnDto.data = await this.dto.repo.find();
  }

  private startPage(page: number, limit: number) {
    return page * limit;
  }

  async _validate(dto: BaseDto): Promise<boolean> {
    const rules = dto.rules;
    this.valid = true;
    if (rules.comparisonKind == KindEnum.UINQUE) {
      const scenarios = [];
      rules.field.forEach((rule: string) => {
        const scenario = new ValidateScenarioDto();
        scenario.table = this.dto.repo.metadata.tableName;
        scenario.field = rule;
        scenario.value = dto[rule];
        scenarios.push(scenario);
      });
      const validated: ClassValidator = new ClassValidator();
      if (rules.method == MethodEnum.CREATE) {
        this.valid = await validated.validateCreate(this.dto.repo, scenarios);
      } else if (rules.method == MethodEnum.UPDATE) {
        this.valid = await validated.validateUpdate(
          dto.id,
          this.dto.repo,
          scenarios,
        );
      }
    }
    return this.valid;
  }
  async active(dto: DeleteDto): Promise<ReturnDto> {
    this.dto.id = dto.id;
    const item = await this.dto.repo.findOne({
      where: {
        id: this.dto.id,
      },
    });
    if (!item) {
      this.returnDto.isSuccess = false;
      // traducir
      this.returnDto.returnCode = CodeEnum.BAD_REQUEST;
    } else if (item.isUsed == true) {
      this.returnDto.isSuccess = false;
      // traducir
      this.returnDto.returnCode = CodeEnum.BAD_REQUEST;
    } else {
      item.isActive = !item.isActive;
      this.returnDto.data = await this.dto.repo.save(item);
    }
    return this.returnDto;
  }

  async seaching(searchingDto: SearchingDto): Promise<ReturnDto> {
    try {
      let query = this.dto.repo.createQueryBuilder(
        searchingDto.mainAlias || 'main',
      );

      if (searchingDto.hasRelatingTable) {
        query.select(
          searchingDto.mainTableFields.map(
            (field) => `${searchingDto.mainAlias || 'main'}.${field}`,
          ),
        );
      } else {
        // 1. Primero seleccionamos los campos de la tabla principal
        query.select(
          searchingDto.mainTableFields.map(
            (field) => `${searchingDto.mainAlias || 'main'}.${field}`,
          ),
        );

        // 2. Agregamos las relaciones en orden jerárquico
        if (searchingDto.relationTable?.length > 0) {
          // Ordenar las relaciones por nivel jerárquico
          const sortedRelations = this.sortRelationsByHierarchy(
            searchingDto.relationTable,
          );

          for (const relation of sortedRelations) {
            // Construir el path completo para la relación
            const joinPath = this.buildJoinPath(relation, sortedRelations);

            // Realizar el join con el path correcto
            query.leftJoinAndSelect(joinPath, relation.alias);

            // Agregar los campos de la tabla relacionada
            if (relation.TableFields?.length > 0) {
              relation.TableFields.forEach((field) => {
                query.addSelect(`${relation.alias}.${field}`);
              });
            }
          }
        }

        // 3. Aplicar filtros de la tabla principal
        if (searchingDto.filters?.length > 0) {
          searchingDto.filters.forEach((filter) => {
            query.andWhere(
              `${searchingDto.mainAlias || 'main'}.${filter.field} LIKE :${filter.field}`,
              { [filter.field]: `%${filter.value}%` },
            );
          });
        }

        // 4. Aplicar filtros de las tablas relacionadas
        if (searchingDto.relationTable?.length > 0) {
          for (const relation of searchingDto.relationTable) {
            if (relation.filters?.length > 0) {
              relation.filters.forEach((filter) => {
                const paramName = `${relation.alias}_${filter.field}`;
                query.andWhere(
                  `${relation.alias}.${filter.field} LIKE :${paramName}`,
                  { [paramName]: `%${filter.value}%` },
                );
              });
            }
          }
        }
      }

      // Ejecutar la consulta
      const item = await query.getMany();
      if (!item || item.length === 0) {
        this.returnDto.isSuccess = false;
        this.returnDto.returnCode = CodeEnum.NOT_FOUND;
        return this.returnDto;
      }

      this.returnDto.data = item;
      return this.returnDto;
    } catch (error) {
      this.returnDto.isSuccess = false;
      this.returnDto.returnCode = CodeEnum.INTERNAL_ERROR;
      this.returnDto.errorMessage = error.message;
      return this.returnDto;
    }
  }

  // Método auxiliar para ordenar las relaciones jerárquicamente
  private sortRelationsByHierarchy(
    relations: RelationTable[],
  ): RelationTable[] {
    const levelMap = new Map<string, number>();

    // Asignar niveles a las tablas
    relations.forEach((relation) => {
      if (relation.originTable === this.dto.repo.metadata.tableName) {
        levelMap.set(relation.alias, 1);
      } else {
        const parentLevel = levelMap.get(relation.originTable) || 0;
        levelMap.set(relation.alias, parentLevel + 1);
      }
    });

    // Ordenar por nivel
    return [...relations].sort(
      (a, b) => (levelMap.get(a.alias) || 0) - (levelMap.get(b.alias) || 0),
    );
  }

  // Método auxiliar para construir el path de join
  private buildJoinPath(
    relation: RelationTable,
    allRelations: RelationTable[],
  ): string {
    if (relation.originTable === this.dto.repo.metadata.tableName) {
      return `${relation.originTable}.${relation.relatedField}`;
    }

    // Encontrar el alias de la tabla origen
    const parentRelation = allRelations.find(
      (r) => r.alias === relation.originTable,
    );
    if (!parentRelation) {
      return `${relation.originTable}.${relation.relatedField}`;
    }

    return `${relation.originTable}.${relation.relatedField}`;
  }
}
