// Purpose: Express middleware to handle async errors. This middleware will be used in place of try catch block in async functions.
import { Request, Response, NextFunction } from 'express';

const asyncHandler = (requestHandler: Function) => {
    (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    }
}

export { asyncHandler };