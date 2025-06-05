import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { QueryDSL, FilterCondition, JoinCondition, SortCondition, ComparisonOperator, LogicalOperator } from '../dto/query.dsl.dto';
import { Logger } from '@nestjs/common';

@Injectable()
export class QueryBuilderService {
  constructor(
    private readonly logger: Logger
  ) {}

  /**
   * Construye una consulta TypeORM a partir de un DSL
   * @param repository - Repositorio TypeORM
   * @param queryDSL - DSL de la consulta
   * @param options - Opciones adicionales para la construcción de la consulta
   * @returns QueryBuilder construido
   * @throws QueryBuilderError si hay errores en la construcción
   */
  buildQuery<T>(
    repository: Repository<T>,
    queryDSL: QueryDSL,
    options?: QueryBuilderOptions
  ): SelectQueryBuilder<T> {
    const mainAlias = queryDSL.mainAlias || 'main';
    const queryBuilder = repository.createQueryBuilder(mainAlias);

    // Aplicar selección de campos
    this.applySelects(queryBuilder, queryDSL.select, mainAlias);

    // Aplicar joins y sus relaciones anidadas
    if (queryDSL.joins && queryDSL.joins.length > 0) {
      this.applyJoins(queryBuilder, queryDSL.joins, mainAlias);
    }

    // Aplicar condiciones where
    if (queryDSL.where && queryDSL.where.length > 0) {
      this.applyWhereConditions(queryBuilder, queryDSL.where, mainAlias);
    }

    // Aplicar ordenamiento
    if (queryDSL.sort && queryDSL.sort.length > 0) {
      this.applySorting(queryBuilder, queryDSL.sort, mainAlias);
    }

    // Aplicar paginación
    if (queryDSL.skip !== undefined) {
      queryBuilder.skip(queryDSL.skip);
    }
    if (queryDSL.take !== undefined) {
      queryBuilder.take(queryDSL.take);
    }



    return queryBuilder;
  }

  /**
   * Aplica la selección de campos a la consulta
   * @param queryBuilder QueryBuilder de TypeORM
   * @param selects Campos a seleccionar
   * @param alias Alias de la tabla
   */
  private applySelects(queryBuilder: SelectQueryBuilder<any>, selects: string[], alias: string): void {
    if (selects && selects.length > 0) {
      queryBuilder.select(selects.map(field => `${alias}.${field}`));
    }
  }

  /**
   * Aplica joins y sus relaciones anidadas
   * @param queryBuilder QueryBuilder de TypeORM
   * @param joins Condiciones de join
   * @param parentAlias Alias de la tabla padre
   */
  private applyJoins(
    queryBuilder: SelectQueryBuilder<any>,
    joins: JoinCondition[],
    parentAlias: string
  ): void {
    joins.forEach(join => {
      const joinMethod = this.getJoinMethod(join.type);
      
      // Aplicar el join principal
      queryBuilder[joinMethod](join.table, join.alias, join.condition);

      // Aplicar filtros en la tabla unida
      if (join.filters && join.filters.length > 0) {
        this.applyWhereConditions(queryBuilder, join.filters, join.alias);
      }

      // Aplicar ordenamiento en la tabla unida
      if (join.sort && join.sort.length > 0) {
        this.applySorting(queryBuilder, join.sort, join.alias);
      }

      // Aplicar joins anidados recursivamente
      if (join.joins && join.joins.length > 0) {
        this.applyJoins(queryBuilder, join.joins, join.alias);
      }
    });
  }

  /**
   * Aplica condiciones where a la consulta
   * @param queryBuilder QueryBuilder de TypeORM
   * @param conditions Condiciones de filtro
   * @param alias Alias de la tabla
   */
  private applyWhereConditions(
    queryBuilder: SelectQueryBuilder<any>,
    conditions: FilterCondition[],
    alias: string
  ): void {
    conditions.forEach((condition, index) => {
      const tableAlias = condition.tableAlias || alias;
      const paramName = `${condition.field}_${index}`;
      const fieldPath = `${tableAlias}.${condition.field}`;
      
      const { whereClause, parameters } = this.buildWhereClause(condition, fieldPath, paramName);

      if (index === 0) {
        queryBuilder.where(whereClause, parameters);
      } else {
        const logicalOperator = condition.logicalOperator || LogicalOperator.AND;
        queryBuilder[logicalOperator === LogicalOperator.AND ? 'andWhere' : 'orWhere'](
          whereClause,
          parameters
        );
      }
    });
  }

  /**
   * Construye la cláusula where y sus parámetros
   * @param condition Condición de filtro
   * @param fieldPath Ruta completa del campo
   * @param paramName Nombre del parámetro
   * @returns Objeto con la cláusula where y sus parámetros
   */
  private buildWhereClause(
    condition: FilterCondition,
    fieldPath: string,
    paramName: string
  ): { whereClause: string; parameters: Record<string, any> } {
    let whereClause = '';
    let parameters: Record<string, any> = {};

    switch (condition.operator) {
      case ComparisonOperator.EQUALS:
        whereClause = `${fieldPath} = :${paramName}`;
        parameters[paramName] = condition.value;
        break;
      case ComparisonOperator.NOT_EQUALS:
        whereClause = `${fieldPath} != :${paramName}`;
        parameters[paramName] = condition.value;
        break;
      case ComparisonOperator.GREATER_THAN:
        whereClause = `${fieldPath} > :${paramName}`;
        parameters[paramName] = condition.value;
        break;
      case ComparisonOperator.GREATER_THAN_OR_EQUAL:
        whereClause = `${fieldPath} >= :${paramName}`;
        parameters[paramName] = condition.value;
        break;
      case ComparisonOperator.LESS_THAN:
        whereClause = `${fieldPath} < :${paramName}`;
        parameters[paramName] = condition.value;
        break;
      case ComparisonOperator.LESS_THAN_OR_EQUAL:
        whereClause = `${fieldPath} <= :${paramName}`;
        parameters[paramName] = condition.value;
        break;
      case ComparisonOperator.LIKE:
        whereClause = `${fieldPath} LIKE :${paramName}`;
        parameters[paramName] = `%${condition.value}%`;
        break;
      case ComparisonOperator.IN:
        whereClause = `${fieldPath} IN (:...${paramName})`;
        parameters[paramName] = condition.value;
        break;
      case ComparisonOperator.NOT_IN:
        whereClause = `${fieldPath} NOT IN (:...${paramName})`;
        parameters[paramName] = condition.value;
        break;
      case ComparisonOperator.IS_NULL:
        whereClause = `${fieldPath} IS NULL`;
        break;
      case ComparisonOperator.IS_NOT_NULL:
        whereClause = `${fieldPath} IS NOT NULL`;
        break;
      case ComparisonOperator.BETWEEN:
        whereClause = `${fieldPath} BETWEEN :${paramName}_start AND :${paramName}_end`;
        parameters[`${paramName}_start`] = condition.value[0];
        parameters[`${paramName}_end`] = condition.value[1];
        break;
      case ComparisonOperator.RAW:
        whereClause = condition.value as string;
        break;
    }

    return { whereClause, parameters };
  }

  /**
   * Aplica ordenamiento a la consulta
   * @param queryBuilder QueryBuilder de TypeORM
   * @param sortConditions Condiciones de ordenamiento
   * @param alias Alias de la tabla
   */
  private applySorting(
    queryBuilder: SelectQueryBuilder<any>,
    sortConditions: SortCondition[],
    alias: string
  ): void {
    sortConditions.forEach(condition => {
      const direction = condition.direction === 'asc' ? 'ASC' : 'DESC';
      
      const tableAlias = condition.tableAlias || alias;
      queryBuilder.addOrderBy(
        `${tableAlias}.${condition.field}`,
        direction
      );
    });
  }

  /**
   * Obtiene el método de join correspondiente
   * @param type Tipo de join
   * @returns Nombre del método de join
   */
  private getJoinMethod(type: 'inner' | 'left' | 'right'): string {
    switch (type) {
      case 'inner':
        return 'innerJoinAndSelect';
      case 'right':
        return 'rightJoinAndSelect';
      default:
        return 'leftJoinAndSelect';
    }
  }

  // Agregar caché de consultas
  private queryCache = new Map<string, any>();
  private readonly CACHE_TTL = 300; // 5 minutos

  // Método para generar clave de caché
  private generateCacheKey(queryDSL: QueryDSL): string {
    return JSON.stringify({
      ...queryDSL,
      timestamp: Math.floor(Date.now() / (this.CACHE_TTL * 1000))
    });
  }

  // Método para obtener consulta del caché
  private getCachedQuery<T>(cacheKey: string): SelectQueryBuilder<T> | null {
    const cached = this.queryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL * 1000) {
      return cached.query;
    }
    return null;
  }

  // Método para guardar consulta en caché
  private cacheQuery<T>(cacheKey: string, query: SelectQueryBuilder<T>): void {
    this.queryCache.set(cacheKey, {
      query,
      timestamp: Date.now()
    });
  }

  // Agregar límites de seguridad
  private readonly MAX_JOIN_DEPTH = 5;
  private readonly MAX_WHERE_CONDITIONS = 20;
  private readonly MAX_SORT_CONDITIONS = 5;



  private validateJoinDepth(joins: JoinCondition[], depth: number = 0): void {
    if (depth > this.MAX_JOIN_DEPTH) {
      throw new Error(`Maximum join depth of ${this.MAX_JOIN_DEPTH} exceeded`);
    }
    
    joins?.forEach(join => {
      if (join.joins) {
        this.validateJoinDepth(join.joins, depth + 1);
      }
    });
  }



  // Método para contar joins
  private countJoins(joins: JoinCondition[]): number {
    return joins?.reduce((count, join) => {
      return count + 1 + (join.joins ? this.countJoins(join.joins) : 0);
    }, 0) || 0;
  }





  // Clase de error personalizada
  private handleQueryError(error: Error): never {
    if (error instanceof QueryBuilderError) {
      throw error;
    }
    
    this.logger.error('Query builder error', {
      error: error.message,
      stack: error.stack
    });
    
    throw new QueryBuilderError(
      'Error building query',
      'QUERY_BUILDER_ERROR',
      error
    );
  }
}

// Clase de error personalizada
export class QueryBuilderError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'QueryBuilderError';
  }
}

// Interfaz para opciones adicionales
export interface QueryBuilderOptions {
  useCache?: boolean;
  validateSecurity?: boolean;
  trackMetrics?: boolean;
  optimizeQuery?: boolean;
} 