/**
 * @author WMXPY
 * @namespace Core
 * @description Coco
 */

import { isCallingRoot } from "../command/util";
import { ERROR_CODE } from "../panic/declare";
import { Panic } from "../panic/panic";
import { Command } from "./command";
import { COCO_EVENT } from "./declare";

export class Coco {

    public static create(): Coco {
        return new Coco();
    }

    private _rootCommand: Command | null;
    private readonly _commands: Command[];

    private readonly _eventListeners: Map<COCO_EVENT, (...args: any[]) => void>;

    private constructor() {

        this._rootCommand = null;
        this._commands = [];

        this._eventListeners = new Map<COCO_EVENT, (...args: any[]) => void>();
    }

    public rootCommand(command: Command): this {
        this._rootCommand = command;
        return this;
    }

    public command(command: Command): this {
        this._commands.push(command);
        return this;
    }

    public on(event: COCO_EVENT, listener: () => void) {
        this._eventListeners.set(event, listener);
    }

    public emit(event: COCO_EVENT, ...args: any[]) {
        if (this._eventListeners.has(event)) {
            const listener: (...args: any[]) => void = this._eventListeners.get(event) as (...args: any[]) => void;
            listener(...args);
        }
    }

    public async go(argv: string[]): Promise<void> {

        const args: string[] = [...argv];

        if (args.length < 2) {
            throw Panic.code(ERROR_CODE.INVALID_ARGV, argv.join(' '));
        }

        const environment: string = args.shift() as string;
        const executer: string = args.shift() as string;

        this.emit(COCO_EVENT.SYSTEM_CALL_INFO, environment, executer);

        if (isCallingRoot(args)) {
            if (this._rootCommand) {
                this._rootCommand.execute(args);
            }
            return;
        }

        const calling: string | undefined = args.shift();

        if (!calling) {
            throw Panic.code(ERROR_CODE.INVALID_ARGV, calling as any);
        }

        for (const command of this._commands) {
            if (command.match(calling)) {
                await command.execute(args);
                return;
            }
        }

        return;
    }
}
