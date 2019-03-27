/**
 * @author WMXPY
 * @namespace Core
 * @description Command
 */

import { isOption } from "../command/util";
import { ERROR_CODE } from "../panic/declare";
import { Panic } from "../panic/panic";
import { Argument } from "./argument";
import { Option } from "./option";

export type Executable = (inputs: Record<string, string>) => void;

export class Command {

    public static create(command: string): Command {
        return new Command(command);
    }

    private readonly _command: string;
    private readonly _arguments: Argument[];
    private readonly _options: Option[];

    private readonly _listeners: Executable[];

    private constructor(command: string) {
        this._command = command;
        this._arguments = [];
        this._options = [];

        this._listeners = [];
    }

    public match(command: string): boolean {

        return command === this._command;
    }

    public argument(arg: Argument): this {

        this._arguments.push(arg);
        return this;
    }

    public option(option: Option): this {

        this._options.push(option);
        return this;
    }

    public execute(args: string[]): void {

        const record: Record<string, string> = this.parseArgs(args);
        this._listeners.forEach((executable: Executable) => {
            executable(record);
        });
        return;
    }

    public then(func: Executable): this {

        this._listeners.push(func);
        return this;
    }

    public findOption(key: string): Option | null {

        for (const option of this._options) {
            if (option.match(key)) {
                return option;
            }
        }
        return null;
    }

    public parseArgs(args: string[]): Record<string, string> {

        const result: Record<string, string> = {};
        const tempArguments: string[] = [];

        for (let pointer = 0; pointer < args.length; pointer++) {
            const current: string = args[pointer];
            if (isOption(current)) {
                const option: Option | null = this.findOption(current);

                if (option.isBoolean) {
                    result[option.name] = "true";
                } else {
                    const next: string = args[++pointer];
                    result[option.name] = next;
                }
            } else {
                tempArguments.push(current);
            }
        }

        if (tempArguments.length > this._arguments.length) {
            throw Panic.code(ERROR_CODE.TOO_MANY_ARGUMENTS);
        }

        for (const argument of this._arguments) {
            const first: string | undefined = tempArguments.shift();

            if (!first) {
                if (!argument.isOptional) {
                    throw Panic.code(ERROR_CODE.INSUFFICIENT_ARGUMENTS);
                }
                return result;
            }
            result[argument.name] = first;
        }
        return result;
    }
}
