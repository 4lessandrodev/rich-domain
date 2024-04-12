import { platform } from "../../lib/utils";

describe('platform', () => {
    it('should return true if process is defined', () => {
        const process = {};
        const isNodeJS = platform.isNodeJs(process);
        expect(isNodeJS).toBeTruthy();
    });

    it('should return false if process is not defined', () => {
        const process = undefined;
        const isNodeJS = platform.isNodeJs(process);
        expect(isNodeJS).toBeFalsy();
    });

    it('should return true if window is defined', () => {
        const window = {};
        const isBrowser = platform.isBrowser(window);
        expect(isBrowser).toBeTruthy();
    });

    it('should return false if process is not defined', () => {
        const window = undefined;
        const isBrowser = platform.isBrowser(window);
        expect(isBrowser).toBeFalsy();
    });
});
