/**
 * @author WMXPY
 * @namespace Core
 * @description Declare
 */

export enum CORE_EVENT {

    FINISH = "FINISH",
    SYSTEM_CALL_INFO = "SYSTEM_CALL_INFO",
}

export type CocoEventArgs = {

    [CORE_EVENT.FINISH]: [],
    [CORE_EVENT.SYSTEM_CALL_INFO]: [string, string],
};

export type CocoEventLister<T extends CORE_EVENT> = (...args: CocoEventArgs[T]) => void | Promise<void>;
