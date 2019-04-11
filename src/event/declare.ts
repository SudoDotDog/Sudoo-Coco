/**
 * @author WMXPY
 * @namespace Core
 * @description Declare
 */

export enum CORE_EVENT {

    SUCCEED = "SUCCEED",
    FAILED = "FAILED",
    SYSTEM_CALL_INFO = "SYSTEM_CALL_INFO",
}

export type CocoEventArgs = {

    [CORE_EVENT.SUCCEED]: [],
    [CORE_EVENT.FAILED]: [],
    [CORE_EVENT.SYSTEM_CALL_INFO]: [string, string],
};

export type CocoEventLister<T extends CORE_EVENT> = (...args: CocoEventArgs[T]) => void | Promise<void>;
