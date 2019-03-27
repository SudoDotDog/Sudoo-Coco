/**
 * @author WMXPY
 * @namespace Core
 * @description Command
 */

export type Option = {
    name: string;
    description: string;
    keys: string[];
};

export type Argument = {
    name: string;
    description: string;
};

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

    public argument(name: string, description: string): this {

        this._arguments.push({
            name,
            description,
        });
        return this;
    }

    public option(name: string, description: string, key: string, ...alias: string[]): this {

        this._options.push({
            name,
            description,
            keys: [key, ...alias],
        });
        return this;
    }

    public parseArgs(args: string[]): Record<string, string> {

        return {};
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
}
