/**
 * @author WMXPY
 * @namespace Panic
 * @description Panic
 */

import Connor, { ConnorError, ErrorCreationFunction } from "connor";
import { ERROR_CODE, ERROR_LIST, MODULE_NAME } from "./declare";

export class Panic {

    public static code(code: ERROR_CODE, ...replaces: string[]): ConnorError {

        const panic: Panic = this._getInstance();
        return panic.withCode(code, ...replaces);
    }

    private static _instance: Panic | null = null;

    private static _getInstance(): Panic {

        if (!this._instance) {
            this._instance = new Panic();
        }
        return this._instance as Panic;
    }

    private readonly _getError: ErrorCreationFunction;

    private constructor() {

        Connor.dictionary(MODULE_NAME, ERROR_LIST);
        this._getError = Connor.getErrorCreator(MODULE_NAME);
    }

    public withCode(code: ERROR_CODE, ...replaces: string[]): ConnorError {

        return this._getError(code, ...replaces);
    }
}
