/**
 * @author WMXPY
 * @namespace Panic
 * @description Declare
 */

export const MODULE_NAME = 'COCO';

export enum ERROR_CODE {

    INVALID_ARGV = 1005,

    TOO_MANY_ARGUMENTS = 1250,
    INSUFFICIENT_ARGUMENTS = 1251,
}

export const ERROR_LIST = {

    [ERROR_CODE.INVALID_ARGV]: 'Invalid arguments: "{}"',

    [ERROR_CODE.TOO_MANY_ARGUMENTS]: 'Too many arguments',
    [ERROR_CODE.INSUFFICIENT_ARGUMENTS]: 'Insufficient arguments',
};
