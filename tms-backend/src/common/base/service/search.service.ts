import { Injectable } from '@nestjs/common';
import { DataSource, SelectQueryBuilder } from 'typeorm';
import { 
  SearchInput, 
  JoinCondition, 
  FilterCondition, 
  SortCondition, 
  FieldSelection
} from '../graphql/types/search.types';

@Injectable()
export class SearchService {
  constructor(private readonly dataSource: DataSource) {}

  async search(input: SearchInput): Promise<any[]> {
    const repository = this.dataSource.getRepository(input.mainTable);
    const queryBuilder = repository.createQueryBuilder(input.mainAlias);

    // Aplicar selección de campos
    this.applySelects(queryBuilder, input.fields, input.mainAlias);

    // Aplicar joins
    if (input.joins) {
      this.applyJoins(queryBuilder, input.joins, input.mainAlias);
    }

    // Aplicar filtros
    if (input.filters) {
      this.applyFilters(queryBuilder, input.filters, input.mainAlias);
    }

    // Aplicar ordenamiento
    if (input.sort) {
      this.applySorting(queryBuilder, input.sort, input.mainAlias);
    }

    // Aplicar paginación
    if (input.skip !== undefined) {
      queryBuilder.skip(input.skip);
    }
    if (input.take !== undefined) {
      queryBuilder.take(input.take);
    }

    return queryBuilder.getMany();
  }

  private applySelects(
    queryBuilder: SelectQueryBuilder<any>,
    fields: FieldSelection[],
    alias: string
  ): void {
    fields.forEach(field => {
      const fieldPath = field.alias 
        ? `${alias}.${field.name} as ${field.alias}`
        : `${alias}.${field.name}`;
      queryBuilder.addSelect(fieldPath);
    });
  }

  private applyJoins(
    queryBuilder: SelectQueryBuilder<any>,
    joins: JoinCondition[],
    parentAlias: string
  ): void {
    joins.forEach(join => {
      const joinMethod = this.getJoinMethod(join.type);
      queryBuilder[joinMethod](join.table, join.alias, join.condition);

      if (join.fields) {
        this.applySelects(queryBuilder, join.fields, join.alias);
      }

      if (join.joins) {
        this.applyJoins(queryBuilder, join.joins, join.alias);
      }
    });
  }

  private applyFilters(
    queryBuilder: SelectQueryBuilder<any>,
    filters: FilterCondition[],
    alias: string
  ): void {
    filters.forEach((filter, index) => {
      const paramName = `${filter.field}_${index}`;
      const fieldPath = `${alias}.${filter.field}`;
      const whereClause = this.buildWhereClause(filter, fieldPath, paramName);

      if (index === 0) {
        queryBuilder.where(whereClause.clause, whereClause.parameters);
      } else {
        const logicalOperator = filter.logicalOperator || 'AND';
        queryBuilder[logicalOperator === 'AND' ? 'andWhere' : 'orWhere'](
          whereClause.clause,
          whereClause.parameters
        );
      }
    });
  }

  private buildWhereClause(
    filter: FilterCondition,
    fieldPath: string,
    paramName: string
  ): { clause: string; parameters: any } {
    switch (filter.operator) {
      case 'EQ':
        return {
          clause: `${fieldPath} = :${paramName}`,
          parameters: { [paramName]: filter.value }
        };
      case 'NE':
        return {
          clause: `${fieldPath} != :${paramName}`,
          parameters: { [paramName]: filter.value }
        };
      case 'GT':
        return {
          clause: `${fieldPath} > :${paramName}`,
          parameters: { [paramName]: filter.value }
        };
      case 'LT':
        return {
          clause: `${fieldPath} < :${paramName}`,
          parameters: { [paramName]: filter.value }
        };
      case 'GTE':
        return {
          clause: `${fieldPath} >= :${paramName}`,
          parameters: { [paramName]: filter.value }
        };
      case 'LTE':
        return {
          clause: `${fieldPath} <= :${paramName}`,
          parameters: { [paramName]: filter.value }
        };
      case 'LIKE':
        return {
          clause: `${fieldPath} LIKE :${paramName}`,
          parameters: { [paramName]: `%${filter.value}%` }
        };
      case 'IN':
        return {
          clause: `${fieldPath} IN (:...${paramName})`,
          parameters: { [paramName]: filter.values }
        };
      case 'NOT_IN':
        return {
          clause: `${fieldPath} NOT IN (:...${paramName})`,
          parameters: { [paramName]: filter.values }
        };
      case 'IS_NULL':
        return {
          clause: `${fieldPath} IS NULL`,
          parameters: {}
        };
      case 'IS_NOT_NULL':
        return {
          clause: `${fieldPath} IS NOT NULL`,
          parameters: {}
        };
      default:
        throw new Error(`Unsupported operator: ${filter.operator}`);
    }
  }

  private applySorting(
    queryBuilder: SelectQueryBuilder<any>,
    sortConditions: SortCondition[],
    alias: string
  ): void {
    sortConditions.forEach(condition => {
      queryBuilder.addOrderBy(
        `${alias}.${condition.field}`,
        condition.direction
      );
    });
  }

  private getJoinMethod(type: string): string {
    switch (type) {
      case 'INNER':
        return 'innerJoinAndSelect';
      case 'RIGHT':
        return 'rightJoinAndSelect';
      default:
        return 'leftJoinAndSelect';
    }
  }
}

// // VVV  @Post()
//   async search(@Body() input: SearchInput): Promise<any[]> {
//     return this.searchService.search(input);
//   }
