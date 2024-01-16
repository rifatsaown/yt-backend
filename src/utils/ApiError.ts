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
    super(message); // call the parent constructor
    this.statusCode = statusCode;
    this.data = null;
    this.errors = errors;
    this.succes = false;

    // if stack is provided use it else create a new stack trace
    if(statck){
      this.stack = statck; // 
    }else{
      Error.captureStackTrace(this, this.constructor);
    }

  }
}

export { ApiError }