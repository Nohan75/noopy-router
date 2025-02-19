import {ModuleOptions} from "../interfaces/moduleOptions";

export function Module(options: ModuleOptions): ClassDecorator {
    return (target: any) => {
        target.__moduleMetadata = options;
    };
}