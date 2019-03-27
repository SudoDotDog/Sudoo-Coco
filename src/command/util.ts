/**
 * @author WMXPY
 * @namespace Command
 * @description Util
 */

export const isCallingRoot = (args: string[]): boolean => {

    if (args.length === 0) {
        return true;
    }

    if (isOption(args[0])) {
        return true;
    }

    return false;
};

export const isOption = (piece: string): boolean => {

    return piece.substring(0, 1) === '-';
};
