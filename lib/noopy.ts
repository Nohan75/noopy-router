import {Route} from "./interfaces/route";
import {Handler} from "./types/handler";
import {createServer, ServerResponse} from "node:http";
import {IncomingMessage} from "http";
import {Request} from "./classes/Request";
import {Response} from "./classes/Response";
import {ModuleFactory} from "./classes/ModuleFactory";
import {registerControllers} from "./utils/registerRoutes";
import * as path from "path";
import * as fs from "fs";
import * as mime from "mime-types";
import {Middleware} from "./types/middleware";

export class Noopy {
    private routes: Route[] = [];
    private middlewares: Middleware[] = [];

    constructor(private rootModule: any) {}

    extractParams(routePath: string, url: string): Record<string, string> | null {
        const routeParts = routePath.split('/');
        const urlParts = url.split('/');

        if (routeParts.length !== urlParts.length) {
            return null;
        }

        const params: Record<string, string> = {};

        for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(':')) {
                params[routeParts[i].slice(1)] = urlParts[i];
            } else if (routeParts[i] !== urlParts[i]) {
                return null;
            }
        }

        return params;
    }

    private matchRoute(methode: string, url: string): { handler: Handler, params: Record<string, string> } | undefined {
        for (const route of this.routes) {
            const params = this.extractParams(route.path, url);
            if (route.method === methode && params) {
                return { handler: route.handler, params };
            }
        }
        return undefined;
    }

    public get(path: string, handler: Handler): void {
        this.routes.push({path, method: 'GET', handler});
    }

    public post(path: string, handler: Handler): void {
        this.routes.push({path, method: 'POST', handler});
    }

    public put(path: string, handler: Handler): void {
        this.routes.push({path, method: 'PUT', handler});
    }

    public delete(path: string, handler: Handler): void {
        this.routes.push({path, method: 'DELETE', handler});
    }

    public patch(path: string, handler: Handler): void {
        this.routes.push({path, method: 'PATCH', handler});
    }

    public use(path: string, handler: Handler): void {
        this.routes.push({path, method: '*', handler});
    }

    public useMiddleware(middleware: Middleware): void {
        this.middlewares.push(middleware);
    }

    private executeMiddlewares(req: Request, res: Response, middlewares: Middleware[], index: number, finalHandler: () => void): void {
        if (index < middlewares.length) {
            middlewares[index](req, res, () => this.executeMiddlewares(req, res, middlewares, index + 1, finalHandler));
        } else {
            finalHandler();
        }
    }

    public init() {
        const appModule = ModuleFactory.create(this.rootModule);
        appModule.imports.forEach((importedModule: any) => {
            registerControllers(this, importedModule.controllers);
        });
    }

    public listen(port: number): void {
        const server = createServer((req: IncomingMessage, res: ServerResponse) => {
            const request = new Request(req);
            const response = new Response(res);
            const matchedHandler = this.matchRoute(request.method, request.url);

            this.executeMiddlewares(request, response, this.middlewares, 0, () => {
                if (matchedHandler) {
                    const { handler, params } = matchedHandler;
                    request.params = params;
                    handler(request, response);
                } else {
                    response.statusCode = 404;
                    response.json({message: 'Not found'});
                }
            });
        });
        server.listen(port, () => {
            console.log(`🚀 Server is running on http://localhost:${port}`);
        });
    }
}
