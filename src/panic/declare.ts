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
    DUPLICATED_OPTION = 1301,
    REQUIRED_OPTION_INSUFFICIENT = 1302,

    MULTIPLE_COMMAND_MATCHED = 1401,

    NO_ENVIRONMENT_VARIABLE_ASSIGNED = 2004,
    NO_TARGET_ENVIRONMENT_VARIABLE_FOUND = 2005,
}

export const ERROR_LIST = {

    [ERROR_CODE.INVALID_ARGV]: 'Invalid arguments: "{}"',

    [ERROR_CODE.TOO_MANY_ARGUMENTS]: 'Too many arguments',
    [ERROR_CODE.INSUFFICIENT_ARGUMENTS]: 'Insufficient arguments',

    [ERROR_CODE.OPTION_NOT_FOUND]: 'Option: "{}" not found',
    [ERROR_CODE.DUPLICATED_OPTION]: 'Duplicated Option: "{}"',
    [ERROR_CODE.REQUIRED_OPTION_INSUFFICIENT]: 'Required option insufficient',

    [ERROR_CODE.MULTIPLE_COMMAND_MATCHED]: 'Matched multiple commands: "{}"',

    [ERROR_CODE.NO_ENVIRONMENT_VARIABLE_ASSIGNED]: 'No Env Var assigned',
    [ERROR_CODE.NO_TARGET_ENVIRONMENT_VARIABLE_FOUND]: 'No target: "{}" Env Var found',
};

export const panic: Panic<ERROR_CODE> = Panic.withDictionary(MODULE_NAME, ERROR_LIST);
