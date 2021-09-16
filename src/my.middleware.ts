import { NestMiddleware, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';


@Injectable()
export class MyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('req.path', req.path);
    res.send(req.path);
  }
}
