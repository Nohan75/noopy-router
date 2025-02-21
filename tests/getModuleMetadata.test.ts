import { getModuleMetadata } from '../lib/utils/getModuleMetadata';

describe('getModuleMetadata', () => {
    it('should return module metadata if it exists', () => {
        const target = { __moduleMetadata: { controllers: [], providers: [] } };
        expect(getModuleMetadata(target)).toEqual({ controllers: [], providers: [] });
    });

    it('should return undefined if module metadata does not exist', () => {
        const target = {};
        expect(getModuleMetadata(target)).toBeUndefined();
    });
});
