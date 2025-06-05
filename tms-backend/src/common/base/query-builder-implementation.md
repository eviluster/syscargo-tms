# Implementación de Buscador Genérico con Vue.js y NestJS

## 1. Estructura de Tipos (Frontend)

```typescript
// types/query.ts
export enum ComparisonOperator {
  EQUALS = 'eq',
  NOT_EQUALS = 'neq',
  GREATER_THAN = 'gt',
  GREATER_THAN_OR_EQUAL = 'gte',
  LESS_THAN = 'lt',
  LESS_THAN_OR_EQUAL = 'lte',
  LIKE = 'like',
  IN = 'in',
  NOT_IN = 'notIn',
  IS_NULL = 'isNull',
  IS_NOT_NULL = 'isNotNull',
  BETWEEN = 'between',
  RAW = 'raw'
}

export enum LogicalOperator {
  AND = 'and',
  OR = 'or'
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

export interface FilterCondition {
  field: string;
  operator: ComparisonOperator;
  value: any;
  logicalOperator?: LogicalOperator;
  tableAlias?: string;
}

export interface SortCondition {
  field: string;
  direction: SortDirection;
  tableAlias?: string;
}

export interface JoinCondition {
  table: string;
  alias: string;
  condition: string;
  type: 'inner' | 'left' | 'right';
  filters?: FilterCondition[];
  joins?: JoinCondition[];
  sort?: SortCondition[];
}

export interface QueryDSL {
  mainAlias?: string;
  select: string[];
  where?: FilterCondition[];
  joins?: JoinCondition[];
  sort?: SortCondition[];
  skip?: number;
  take?: number;
}
```

## 2. Composable para Construcción de Consultas (Frontend)

```typescript
// composables/useQueryBuilder.ts
import { ref, computed } from 'vue';
import type { QueryDSL, FilterCondition, JoinCondition, SortCondition } from '@/types/query';
import { ComparisonOperator, LogicalOperator, SortDirection } from '@/types/query';

export function useQueryBuilder() {
  const query = ref<QueryDSL>({
    select: [],
    where: [],
    joins: [],
    sort: [],
    skip: 0,
    take: 10
  });

  // Métodos para construir la consulta
  const addSelect = (fields: string[]) => {
    query.value.select = [...query.value.select, ...fields];
  };

  const addFilter = (filter: FilterCondition) => {
    if (!query.value.where) query.value.where = [];
    query.value.where.push(filter);
  };

  const addJoin = (join: JoinCondition) => {
    if (!query.value.joins) query.value.joins = [];
    query.value.joins.push(join);
  };

  const addSort = (sort: SortCondition) => {
    if (!query.value.sort) query.value.sort = [];
    query.value.sort.push(sort);
  };

  const setPagination = (skip: number, take: number) => {
    query.value.skip = skip;
    query.value.take = take;
  };

  // Métodos de utilidad para crear condiciones comunes
  const createLikeFilter = (field: string, value: string, tableAlias?: string): FilterCondition => ({
    field,
    operator: ComparisonOperator.LIKE,
    value,
    tableAlias
  });

  const createEqualsFilter = (field: string, value: any, tableAlias?: string): FilterCondition => ({
    field,
    operator: ComparisonOperator.EQUALS,
    value,
    tableAlias
  });

  const createSort = (field: string, direction: SortDirection, tableAlias?: string): SortCondition => ({
    field,
    direction,
    tableAlias
  });

  return {
    query,
    addSelect,
    addFilter,
    addJoin,
    addSort,
    setPagination,
    createLikeFilter,
    createEqualsFilter,
    createSort
  };
}
```

## 3. Componente de Búsqueda Genérico (Frontend)

```vue
<!-- components/GenericSearch.vue -->
<template>
  <div class="generic-search">
    <div class="search-filters">
      <div v-for="(filter, index) in filters" :key="index" class="filter-item">
        <select v-model="filter.field">
          <option v-for="field in availableFields" :key="field.value" :value="field.value">
            {{ field.label }}
          </option>
        </select>
        <select v-model="filter.operator">
          <option v-for="op in operators" :key="op.value" :value="op.value">
            {{ op.label }}
          </option>
        </select>
        <input v-model="filter.value" type="text" />
        <button @click="removeFilter(index)">Remove</button>
      </div>
      <button @click="addFilter">Add Filter</button>
    </div>

    <div class="search-sort">
      <div v-for="(sort, index) in sorts" :key="index" class="sort-item">
        <select v-model="sort.field">
          <option v-for="field in availableFields" :key="field.value" :value="field.value">
            {{ field.label }}
          </option>
        </select>
        <select v-model="sort.direction">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        <button @click="removeSort(index)">Remove</button>
      </div>
      <button @click="addSort">Add Sort</button>
    </div>

    <div class="pagination">
      <input v-model.number="pageSize" type="number" min="1" />
      <button @click="search">Search</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQueryBuilder } from '@/composables/useQueryBuilder';
import type { FilterCondition, SortCondition } from '@/types/query';
import { ComparisonOperator, SortDirection } from '@/types/query';

const props = defineProps<{
  availableFields: Array<{ value: string; label: string }>;
  onSearch: (query: any) => Promise<void>;
}>();

const { query, addFilter, addSort, setPagination } = useQueryBuilder();

const filters = ref<FilterCondition[]>([]);
const sorts = ref<SortCondition[]>([]);
const pageSize = ref(10);
const currentPage = ref(1);

const operators = [
  { value: ComparisonOperator.EQUALS, label: 'Equals' },
  { value: ComparisonOperator.LIKE, label: 'Contains' },
  { value: ComparisonOperator.GREATER_THAN, label: 'Greater Than' },
  { value: ComparisonOperator.LESS_THAN, label: 'Less Than' },
  // ... otros operadores
];

const addFilter = () => {
  filters.value.push({
    field: '',
    operator: ComparisonOperator.EQUALS,
    value: ''
  });
};

const removeFilter = (index: number) => {
  filters.value.splice(index, 1);
};

const addSort = () => {
  sorts.value.push({
    field: '',
    direction: SortDirection.ASC
  });
};

const removeSort = (index: number) => {
  sorts.value.splice(index, 1);
};

const search = async () => {
  // Construir la consulta
  query.value.where = filters.value;
  query.value.sort = sorts.value;
  setPagination((currentPage.value - 1) * pageSize.value, pageSize.value);

  // Ejecutar la búsqueda
  await props.onSearch(query.value);
};
</script>

<style scoped>
.generic-search {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.filter-item,
.sort-item {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

select, input {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
```

## 4. Ejemplo de Uso en un Componente Específico (Frontend)

```vue
<!-- views/UsersView.vue -->
<template>
  <div>
    <h1>User Search</h1>
    
    <GenericSearch
      :available-fields="userFields"
      :on-search="handleSearch"
    />

    <div v-if="loading" class="loading">Loading...</div>
    
    <div v-else class="results">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.createdAt }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import GenericSearch from '@/components/GenericSearch.vue';
import { useQueryBuilder } from '@/composables/useQueryBuilder';
import type { QueryDSL } from '@/types/query';

const users = ref([]);
const loading = ref(false);

const userFields = [
  { value: 'id', label: 'ID' },
  { value: 'name', label: 'Name' },
  { value: 'email', label: 'Email' },
  { value: 'createdAt', label: 'Created At' }
];

const handleSearch = async (query: QueryDSL) => {
  loading.value = true;
  try {
    const response = await fetch('/api/users/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(query)
    });
    
    if (!response.ok) {
      throw new Error('Search failed');
    }
    
    const data = await response.json();
    users.value = data;
  } catch (error) {
    console.error('Search error:', error);
    // Mostrar mensaje de error al usuario
  } finally {
    loading.value = false;
  }
};
</script>
```

## 5. Backend - Controlador

```typescript
// src/users/controllers/users.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { QueryDSL } from '../../common/base/dto/query.dsl.dto';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('search')
  async search(@Body() queryDSL: QueryDSL) {
    return this.usersService.search(queryDSL);
  }
}
```

## 6. Backend - Servicio

```typescript
// src/users/services/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { QueryBuilderService } from '../../common/base/service/query.builder.service';
import { QueryDSL } from '../../common/base/dto/query.dsl.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly queryBuilder: QueryBuilderService
  ) {}

  async search(queryDSL: QueryDSL) {
    const queryBuilder = this.queryBuilder.buildQuery(this.userRepository, queryDSL);
    return await queryBuilder.getMany();
  }
}
```

## 7. Ejemplo de Consulta Compleja

```typescript
// Ejemplo de uso en un servicio
const queryDSL: QueryDSL = {
  mainAlias: 'user',
  select: ['id', 'name', 'email'],
  where: [
    {
      field: 'name',
      operator: ComparisonOperator.LIKE,
      value: 'John',
      logicalOperator: LogicalOperator.AND
    },
    {
      field: 'createdAt',
      operator: ComparisonOperator.BETWEEN,
      value: [startDate, endDate]
    }
  ],
  joins: [
    {
      table: 'orders',
      alias: 'order',
      condition: 'user.id = order.userId',
      type: 'left',
      filters: [
        {
          field: 'status',
          operator: ComparisonOperator.EQUALS,
          value: 'completed'
        }
      ],
      // Relaciones anidadas
      joins: [
        {
          table: 'order_items',
          alias: 'item',
          condition: 'order.id = item.orderId',
          type: 'left',
          filters: [
            {
              field: 'quantity',
              operator: ComparisonOperator.GREATER_THAN,
              value: 0
            }
          ],
          // Más relaciones anidadas
          joins: [
            {
              table: 'products',
              alias: 'product',
              condition: 'item.productId = product.id',
              type: 'left',
              filters: [
                {
                  field: 'price',
                  operator: ComparisonOperator.GREATER_THAN,
                  value: 100
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  sort: [
    {
      field: 'createdAt',
      direction: SortDirection.DESC
    }
  ],
  skip: 0,
  take: 10
};
```

## 8. Instalación y Configuración

1. **Frontend (Vue.js)**:
   - Instalar las dependencias necesarias:
   ```bash
   npm install @vueuse/core
   ```

2. **Backend (NestJS)**:
   - Asegurarse de que el módulo QueryBuilderModule esté importado en el módulo principal o en el módulo donde se necesite:
   ```typescript
   @Module({
     imports: [QueryBuilderModule],
     // ...
   })
   export class AppModule {}
   ```

## 9. Consideraciones de Seguridad

1. **Validación de Entrada**:
   - El backend debe validar todos los campos de entrada
   - Limitar la profundidad de las relaciones anidadas
   - Sanitizar los valores de entrada para prevenir inyección SQL

2. **Control de Acceso**:
   - Implementar autenticación y autorización
   - Validar que el usuario tenga acceso a los campos solicitados

3. **Límites de Consulta**:
   - Establecer límites máximos para:
     - Número de registros retornados
     - Profundidad de relaciones
     - Número de condiciones
     - Tamaño de la consulta

## 10. Mejoras Futuras

1. **Caché de Consultas**:
   - Implementar caché para consultas frecuentes
   - Invalidar caché cuando los datos cambien

2. **Optimización de Rendimiento**:
   - Añadir índices a las columnas frecuentemente buscadas
   - Implementar paginación del lado del servidor

3. **Funcionalidades Adicionales**:
   - Exportación de resultados
   - Guardar consultas favoritas
   - Historial de búsquedas
   - Sugerencias de búsqueda 

   // Mejoras en el componente GenericSearch.vue
<template>
  <div class="generic-search">
    <!-- Agregar búsqueda rápida -->
    <div class="quick-search">
      <input 
        v-model="quickSearch" 
        type="text" 
        placeholder="Búsqueda rápida..."
        @keyup.enter="handleQuickSearch"
      />
    </div>

    <!-- Agregar vista de árbol para relaciones -->
    <div class="relations-tree" v-if="showRelations">
      <div 
        v-for="(relation, index) in availableRelations" 
        :key="index"
        class="relation-item"
        @click="toggleRelation(relation)"
      >
        <span :class="{ 'is-selected': isRelationSelected(relation) }">
          {{ relation.label }}
        </span>
        <div v-if="isRelationSelected(relation)" class="relation-filters">
          <!-- Filtros específicos para la relación -->
        </div>
      </div>
    </div>

    <!-- Agregar guardado de consultas -->
    <div class="saved-queries" v-if="savedQueries.length">
      <select v-model="selectedSavedQuery" @change="loadSavedQuery">
        <option value="">Cargar consulta guardada...</option>
        <option 
          v-for="query in savedQueries" 
          :key="query.id" 
          :value="query.id"
        >
          {{ query.name }}
        </option>
      </select>
      <button @click="saveCurrentQuery">Guardar consulta</button>
    </div>

    <!-- Agregar exportación -->
    <div class="export-options">
      <button @click="exportResults('csv')">Exportar CSV</button>
      <button @click="exportResults('excel')">Exportar Excel</button>
      <button @click="exportResults('pdf')">Exportar PDF</button>
    </div>

    <!-- Resto del componente existente -->
  </div>
</template>
```

## 11. Mejoras en el Backend

```typescript
// src/common/base/service/query.builder.service.ts
@Injectable()
export class QueryBuilderService {
  // Agregar caché de consultas
  private queryCache = new Map<string, any>();

  // Agregar validación de seguridad
  private validateQuerySecurity(queryDSL: QueryDSL, user: User) {
    // Validar acceso a campos
    this.validateFieldAccess(queryDSL.select, user);
    
    // Validar profundidad de relaciones
    this.validateRelationDepth(queryDSL.joins);
    
    // Validar límites de consulta
    this.validateQueryLimits(queryDSL);
  }

  // Agregar optimización de consultas
  private optimizeQuery(queryBuilder: SelectQueryBuilder<any>) {
    // Analizar y optimizar la consulta
    this.analyzeQueryPerformance(queryBuilder);
    
    // Aplicar índices sugeridos
    this.applySuggestedIndexes(queryBuilder);
  }

  // Agregar métricas de rendimiento
  private trackQueryPerformance(queryDSL: QueryDSL, executionTime: number) {
    // Registrar métricas de rendimiento
    this.metricsService.trackQueryPerformance({
      query: queryDSL,
      executionTime,
      timestamp: new Date()
    });
  }
}