/**
 * @author WMXPY
 * @namespace Panic
 * @description Declare
 */

import { Panic } from "connor";

export const MODULE_NAME = 'COCO';

export enum ERROR_CODE {

    INVALID_ARGV = 1005,

    TOO_MANY_ARGUMENTS = 1250,
    INSUFFICIENT_ARGUMENTS = 1251,

    OPTION_NOT_FOUND = 1300,
}

export const ERROR_LIST = {

    [ERROR_CODE.INVALID_ARGV]: 'Invalid arguments: "{}"',

    [ERROR_CODE.TOO_MANY_ARGUMENTS]: 'Too many arguments',
    [ERROR_CODE.INSUFFICIENT_ARGUMENTS]: 'Insufficient arguments',

    [ERROR_CODE.OPTION_NOT_FOUND]: 'Option: "{}" not found',
};

export const panic: Panic<ERROR_CODE> = Panic.withDictionary(MODULE_NAME, ERROR_LIST);
