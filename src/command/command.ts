/**
 * @author WMXPY
 * @namespace Core
 * @description Command
 */

import { Argument } from "../argument/argument";
import { Option } from "../option/option";
import { ERROR_CODE, panic } from "../panic/declare";
import { isOption } from "./util";

export type Executable<T = Record<string, string>> = (inputs: T) => Promise<void> | void;

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

    public argument(arg: Argument, ...args: Argument[]): this {

        this._arguments.push(arg, ...args);
        return this;
    }

    public arguments(args: Argument[]): this {

        this._arguments.push(...args);
        return this;
    }

    public option(option: Option, ...options: Option[]): this {

        this._options.push(option, ...options);
        return this;
    }

    public options(options: Option[]): this {

        this._options.push(...options);
        return this;
    }

    public async execute(args: string[], globalOptions: Option[]): Promise<void> {

        const shifted: string[] = args.slice(this._command.length);

        const record: Record<string, string> = this.parseArgs(shifted, globalOptions);
        const promises: Array<void | Promise<void>> = this._listeners.map((executable: Executable) => {
            return executable(record);
        });

        await Promise.all(promises);
        return;
    }

    public then<T extends Record<string, string> = Record<string, string>>(func: Executable<T>): this {

        (this._listeners as Array<Executable<T>>).push(func);
        return this;
    }

    public findOption(key: string, globalOptions: Option[]): Option | null {

        for (const option of this._options.concat(globalOptions)) {
            if (option.match(key)) {
                return option;
            }
        }
        return null;
    }

    public parseArgs(args: string[], globalOptions: Option[]): Record<string, string> {

        const result: Record<string, string> = {};
        const tempArguments: string[] = [];

        const matchOptionSet: Set<Option> = new Set<Option>();

        for (let pointer = 0; pointer < args.length; pointer++) {
            const current: string = args[pointer];
            if (isOption(current)) {
                const option: Option | null = this.findOption(current, globalOptions);

                if (!option) {
                    throw panic.code(ERROR_CODE.OPTION_NOT_FOUND, current);
                }

                if (matchOptionSet.has(option)) {
                    throw panic.code(ERROR_CODE.DUPLICATED_OPTION, current);
                }

                if (option.isBoolean) {
                    result[option.name] = "true";
                } else {
                    const next: string = args[++pointer];
                    result[option.name] = next;
                }

                matchOptionSet.add(option);
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

        const optionRequirementsMat: boolean = [...this._options, ...globalOptions]
            .filter((option: Option) => option.isRequired)
            .every((option: Option) => matchOptionSet.has(option));

        if (!optionRequirementsMat) {
            throw panic.code(ERROR_CODE.REQUIRED_OPTION_INSUFFICIENT);
        }
        return result;
    }
}
