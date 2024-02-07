// Use: Error class for the API errors that will be thrown from the API routes. This class will be used in place of the Error class in the catch block of the async functions.
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
   
    /*
    What is Stack?
    - Stack is a list of function calls that have not yet terminated and are still in execution.
    - The stack is important because it keeps track of the functions that are currently running.
    - It also keeps track of the functions that called the current function.
    - This is what we call the call stack.
    - The call stack is important because it tells us the order in which functions were called.
    - It also tells us which function called the current function.
    - This is important because it lets us know the context in which the current function is running. 
    */
    
    // if stack is provided use it else create a new stack trace
    if(statck){
      this.stack = statck; // 
    }else{
      Error.captureStackTrace(this, this.constructor);
    }

  }
}

export { ApiError };

