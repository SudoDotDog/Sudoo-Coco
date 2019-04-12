/**
 * @author WMXPY
 * @namespace Core
 * @description Command
 */

import { Argument } from "../argument/argument";
import { Option } from "../option/option";
import { ERROR_CODE, panic } from "../panic/declare";
import { isOption } from "./util";

export type Executable = (inputs: Record<string, string>) => Promise<void> | void;

export class Command {

    public static create(command: string): Command {
        return new Command([command]);
    }

    public static commands(commands: string[]): Command {
        return new Command(commands);
    }

    public static multiple(...commands: string[]): Command {
        return new Command(commands);
    }

    public static root(): Command {
        return new Command([]);
    }

    private readonly _command: string[];
    private readonly _arguments: Argument[];
    private readonly _options: Option[];

    private readonly _listeners: Executable[];

    private constructor(command: string[]) {
        this._command = command;
        this._arguments = [];
        this._options = [];

        this._listeners = [];
    }

    public get simulate(): string {
        return this._command.join(' ');
    }

    public match(argv: string[]): boolean {

        return this._command.every((value: string, index: number) => {

            if (value === argv[index]) {
                return true;
            }
            return false;
        });
    }

    public argument(arg: Argument): this {

        this._arguments.push(arg);
        return this;
    }

    public option(option: Option): this {

        this._options.push(option);
        return this;
    }

    public async execute(args: string[]): Promise<void> {

        const shifted: string[] = args.slice(this._command.length);

        const record: Record<string, string> = this.parseArgs(shifted);
        const promises: Array<void | Promise<void>> = this._listeners.map((executable: Executable) => {
            return executable(record);
        });

        await Promise.all(promises);
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

                if (!option) {
                    throw panic.code(ERROR_CODE.OPTION_NOT_FOUND, current);
                }

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
            throw panic.code(ERROR_CODE.TOO_MANY_ARGUMENTS);
        }

        for (const argument of this._arguments) {
            const first: string | undefined = tempArguments.shift();

            if (!first) {
                if (!argument.isOptional) {
                    throw panic.code(ERROR_CODE.INSUFFICIENT_ARGUMENTS);
                }
                return result;
            }
            result[argument.name] = first;
        }
        return result;
    }
}
