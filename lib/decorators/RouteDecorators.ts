interface RouteDefinition {
    method: string;
    path: string;
    handlerName: string;
}

const routes: { [key: string]: RouteDefinition[] } = {};

export function Controller(prefix: string) {
    return function (constructor: Function) {
        const controllerName = constructor.name;
        routes[controllerName] = routes[controllerName] || [];
        routes[controllerName] = routes[controllerName].map(route => ({
            ...route,
            path: `/${prefix}${route.path}`
        }));
    };
}

export function Get(path: string) {
    return function (target: any, propertyKey: string) {
        const controllerName = target.constructor.name;
        routes[controllerName] = routes[controllerName] || [];
        routes[controllerName].push({ method: 'get', path, handlerName: propertyKey });
    };
}

export function Post(path: string) {
    return function (target: any, propertyKey: string) {
        const controllerName = target.constructor.name;
        routes[controllerName] = routes[controllerName] || [];
        routes[controllerName].push({ method: 'post', path, handlerName: propertyKey });
    };
}

export function Put(path: string) {
    return function (target: any, propertyKey: string) {
        const controllerName = target.constructor.name;
        routes[controllerName] = routes[controllerName] || [];
        routes[controllerName].push({ method: 'put', path, handlerName: propertyKey });
    };
}

export function Delete(path: string) {
    return function (target: any, propertyKey: string) {
        const controllerName = target.constructor.name;
        routes[controllerName] = routes[controllerName] || [];
        routes[controllerName].push({ method: 'delete', path, handlerName: propertyKey });
    };
}

export function getRoutes() {
    return routes;
}