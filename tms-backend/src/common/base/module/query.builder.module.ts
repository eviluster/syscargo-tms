import { Module } from '@nestjs/common';
import { QueryBuilderService } from '../service/query.builder.service';

/**
 * Módulo que proporciona el servicio de construcción de consultas
 * Este módulo debe ser importado en cualquier módulo que necesite
 * construir consultas SQL complejas usando el DSL
 */
@Module({
  providers: [QueryBuilderService],
  exports: [QueryBuilderService],
})
export class QueryBuilderModule {} 
// Ejemplo de uso en un servicio
// @Injectable()
// export class YourService {
//   constructor(
//     private readonly queryBuilder: QueryBuilderService,
//     @InjectRepository(YourEntity)
//     private readonly repository: Repository<YourEntity>
//   ) {}

//   async searchComplexQuery() {
//     const queryDSL: QueryDSL = {
//       mainAlias: 'user',
//       select: ['id', 'name', 'email'],
//       where: [
//         {
//           field: 'name',
//           operator: ComparisonOperator.LIKE,
//           value: 'John',
//           logicalOperator: LogicalOperator.AND
//         },
//         {
//           field: 'createdAt',
//           operator: ComparisonOperator.BETWEEN,
//           value: [startDate, endDate]
//         }
//       ],
//       joins: [
//         {
//           table: 'orders',
//           alias: 'order',
//           condition: 'user.id = order.userId',
//           type: 'left',
//           filters: [
//             {
//               field: 'status',
//               operator: ComparisonOperator.EQUALS,
//               value: 'completed'
//             }
//           ],
//           // Relaciones anidadas
//           joins: [
//             {
//               table: 'order_items',
//               alias: 'item',
//               condition: 'order.id = item.orderId',
//               type: 'left',
//               filters: [
//                 {
//                   field: 'quantity',
//                   operator: ComparisonOperator.GREATER_THAN,
//                   value: 0
//                 }
//               ],
//               // Más relaciones anidadas
//               joins: [
//                 {
//                   table: 'products',
//                   alias: 'product',
//                   condition: 'item.productId = product.id',
//                   type: 'left',
//                   filters: [
//                     {
//                       field: 'price',
//                       operator: ComparisonOperator.GREATER_THAN,
//                       value: 100
//                     }
//                   ]
//                 }
//               ]
//             }
//           ]
//         }
//       ],
//       sort: [
//         {
//           field: 'createdAt',
//           direction: SortDirection.DESC
//         }
//       ],
//       skip: 0,
//       take: 10
//     };

//     const queryBuilder = this.queryBuilder.buildQuery(this.repository, queryDSL);
//     return await queryBuilder.getMany();
//   }
// }