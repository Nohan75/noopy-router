import { Handler } from "../types/handler";

export interface Route {
    path: string;
    method: string;
    handler: Handler;
}