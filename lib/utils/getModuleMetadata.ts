import {ModuleOptions} from "../interfaces/moduleOptions";

export function getModuleMetadata(target: any): ModuleOptions | undefined {
    return target.__moduleMetadata;
}