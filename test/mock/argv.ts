/**
 * @author WMXPY
 * @namespace Mock
 * @description Argv
 */

export const createBarkMockArgs = (...args: string[]): string[] => {

    return ['node', 'bark', ...args];
};
