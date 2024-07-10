enum DataTypeEnum {
  Int = 'int',
}

const cast = (expression: string, dataType: DataTypeEnum) =>
  `${expression}::${dataType}`;

export { DataTypeEnum, cast };
