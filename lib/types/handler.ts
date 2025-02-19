import { Request } from "../classes/Request";
import { Response } from "../classes/Response";

export type Handler = (req: Request, res: Response) => void;