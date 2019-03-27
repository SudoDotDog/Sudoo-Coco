/**
 * @author WMXPY
 * @namespace Core
 * @description Coco
 */

import { isCallingRoot } from "../command/util";
import { ERROR_CODE } from "../panic/declare";
import { Panic } from "../panic/panic";
import { Command } from "./command";

export class Coco {

    public static create(): Coco {
        return new Coco();
    }

    private _rootCommand: Command | null;
    private readonly _commands: Command[];

    private constructor() {

        this._rootCommand = null;
        this._commands = [];
    }

    public rootCommand(command: Command): this {
        this._rootCommand = command;
        return this;
    }

    public command(command: Command): this {
        this._commands.push(command);
        return this;
    }

    public go(argv: string[]): void {

        const args: string[] = [...argv];

        if (args.length < 2) {
            throw Panic.code(ERROR_CODE.INVALID_ARGV, argv.join(' '));
        }

        const environment: string = args.shift();
        const executer: string = args.shift();

        if (isCallingRoot(args)) {
            if (this._rootCommand) {
                this._rootCommand.execute(args);
            }
            return;
        }

        const calling: string = args.shift();

        for (const command of this._commands) {
            if (command.match(calling)) {
                command.execute(args);
                return;
            }
        }

        return;
    }
}
