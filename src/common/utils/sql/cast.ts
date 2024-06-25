export enum DataTypeEnum {
  Int = 'int',
}

export const cast = (expression: string, dataType: DataTypeEnum) =>
  `${expression}::${dataType}`;
