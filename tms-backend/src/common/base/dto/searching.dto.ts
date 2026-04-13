
export class RelationTableDto {
    originTable: string;
    relatedField: string;
    alias: string;
    TableFields: string[];
    filters?: { field: string, value: any }[];
}

export class RelationTable {
    // Tabla de origen de la relación
    originTable: string;
    
    // Campo que establece la relación
    relatedField: string;
    
    // Alias para la tabla en la consulta
    alias: string;
    
    // Campos que queremos seleccionar de esta tabla
    TableFields?: string[];
    
    // Filtros específicos para esta tabla
    filters?: Filter[];
  }
  
  // Interfaz para los filtros
  export class Filter {
    // Campo a filtrar
    field: string;
    
    // Valor para el filtro
    value: string | number | boolean;
  }

export class SearchingDto {
    mainAlias?: string;
    mainTableFields: string[];
    hasRelatingTable: boolean;
    // Array de relaciones con otras tablas
    relationTable?: RelationTable[];

    // Filtros para la tabla principal
    filters?: Filter[];
}
   
// Campos a seleccionar de la tabla principal
 
// Indica si tiene tablas relacionadas


