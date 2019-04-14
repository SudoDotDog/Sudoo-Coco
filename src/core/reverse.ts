/**
 * @author WMXPY
 * @namespace Core
 * @description Reverse
 */

import { createInterface, Interface } from 'readline';
import { ReadStream, WriteStream } from 'tty';
import { ERROR_CODE, panic } from '../panic/declare';

export class Reverse {

    public static create(stdin: ReadStream | NodeJS.ReadStream = process.stdin, stdout: WriteStream | NodeJS.WriteStream = process.stdout): Reverse {

        return new Reverse(stdin, stdout);
    }

    private readonly _in: ReadStream | NodeJS.ReadStream;
    private readonly _out: WriteStream | NodeJS.WriteStream;

    private _useEnvironmentVariable: boolean;

    private constructor(stdin: ReadStream | NodeJS.ReadStream, stdout: WriteStream | NodeJS.WriteStream) {

        this._in = stdin;
        this._out = stdout;

        this._useEnvironmentVariable = false;
    }

    public get isTTY(): boolean {

        const isInTTY: boolean = this._in.isTTY || false;
        const isOutTTY: boolean = this._out.isTTY || false;

        return isInTTY && isOutTTY;
    }

    public get isUsingEnvironmentVariable(): boolean {

        return this._useEnvironmentVariable;
    }

    public useEnvironmentVariable(): this {

        this._useEnvironmentVariable = true;
        return this;
    }

    public useReadline(): this {

        this._useEnvironmentVariable = false;
        return this;
    }

    public question(question: string, envVariable?: string): Promise<string> {

        return new Promise<string>((resolve: (response: string) => void, reject: (reason: Error) => void) => {

            if (this.isUsingEnvironmentVariable) {

                if (!envVariable) {
                    reject(panic.code(ERROR_CODE.NO_ENVIRONMENT_VARIABLE_ASSIGNED));
                    return;
                }

                const value: string | undefined = process.env[envVariable];

                if (value) {
                    resolve(value);
                } else {
                    reject(panic.code(ERROR_CODE.NO_TARGET_ENVIRONMENT_VARIABLE_FOUND, envVariable));
                }
                return;
            }

            const readline: Interface = createInterface({
                input: this._in,
                output: this._out,
            });

            readline.question(question, (answer: string) => {

                readline.close();
                resolve(answer);
                return;
            });
        });
    }
}
