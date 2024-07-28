const loggerPipe = <T>(anything: T): T => {
  console.log(anything);

  return anything;
};

export { loggerPipe };
