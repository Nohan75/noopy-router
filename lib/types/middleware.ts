import { Request, Response } from '../';

export type Middleware = (req: Request, res: Response, next: () => void) => void;
