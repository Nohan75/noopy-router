import {Noopy} from "../noopy";
import {getRoutes} from "../decorators/RouteDecorators";

export function registerControllers(app: Noopy, controllers: any[]) {
    const routes = getRoutes();

    controllers.forEach(controller => {
        const controllerName = controller.constructor.name;
        const controllerRoutes = routes[controllerName] || [];

        controllerRoutes.forEach(route => {
            const handler = controller[route.handlerName].bind(controller);
            switch (route.method.toLowerCase()) {
                case 'get':
                    app.get(route.path, handler);
                    break;
                case 'post':
                    app.post(route.path, handler);
                    break;
                case 'put':
                    app.put(route.path, handler);
                    break;
                case 'delete':
                    app.delete(route.path, handler);
                    break;
                default:
                    throw new Error(`Unsupported HTTP method: ${route.method}`);
            }
        });
    });
}