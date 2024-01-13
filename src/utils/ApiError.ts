class ApiError extends Error {
  // type definition
  statusCode: number;
  errors: any[];
  data: null;
  succes: boolean;
  constructor(
    statusCode: number,
    message= 'Something went wrong',
    errors = [],
    statck = ""
  ){
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.errors = errors;
    this.succes = false;

    if(statck){
      this.stack = statck;
    }else{
      Error.captureStackTrace(this, this.constructor);
    }

  }
}

export { ApiError }