import {getModuleMetadata} from "../utils/getModuleMetadata";

export class ModuleFactory {
    static create(module: any) {
        const metadata = getModuleMetadata(module);

        if (!metadata) {
            throw new Error('Module metadata not found');
        }

        const instance = new module();
        const providersMap = new Map();

        const importedModules: any = (metadata.imports || []).map((importedModule) => {
            const importedInstance = this.create(importedModule);
            importedInstance.providers.forEach(provider => {
                providersMap.set(provider.constructor, provider);
            });
            return importedInstance;
        });

        (metadata.providers || []).forEach(provider => {
            providersMap.set(provider, new provider());
        });

        const controllersInstances = (metadata.controllers || []).map(controller => {
            const params = controller.dependencies || [];
            const dependencies = params.map((param: any) => {
                if (!providersMap.has(param)) {
                    providersMap.set(param, new param());
                }
                return providersMap.get(param);
            });
            return new controller(...dependencies);
        });

        return {
            module: instance,
            imports: importedModules,
            controllers: controllersInstances,
            providers: Array.from(providersMap.values()),
        };
    }

}