/**
 * @author WMXPY
 * @namespace Core
 * @description Coco
 */

import { Command } from "../command/command";
import { isCallingRoot } from "../command/util";
import { CocoEventArgs, CocoEventLister, CORE_EVENT } from "../event/declare";
import { Option } from "../option/option";
import { ERROR_CODE, panic } from "../panic/declare";
import { _Array } from "@sudoo/bark/array";

export class Coco {

    public static create(): Coco {
        return new Coco();
    }

    private _rootCommand: Command | null;
    private readonly _commands: Command[];
    private readonly _options: Option[];

    private readonly _eventListeners: Map<CORE_EVENT, Array<CocoEventLister<any>>>;

    private constructor() {

        this._rootCommand = null;
        this._commands = [];
        this._options = [];

        this._eventListeners = new Map<CORE_EVENT, Array<CocoEventLister<any>>>();
    }

    public rootCommand(command: Command): this {

        this._rootCommand = command;
        return this;
    }

    public getRootCommand(): Command | null {

        return this._rootCommand;
    }

    public command(command: Command, ...commands: Command[]): this {

        this._commands.push(command, ...commands);
        return this;
    }

    public commands(commands: Command[]): this {

        this._commands.push(...commands);
        return this;
    }

    public globalOption(option: Option): this {
        this._options.push(option);
        return this;
    }

    public getCommands(): Command[] {
        return this._commands;
    }

    public on<T extends CORE_EVENT>(event: T, listener: CocoEventLister<T>): this {

        if (this._eventListeners.has(event)) {
            const listeners: Array<CocoEventLister<T>> = this._eventListeners.get(event) as Array<CocoEventLister<T>>;
            this._eventListeners.set(event, [...listeners, listener]);
        } else {
            this._eventListeners.set(event, [listener]);
        }
        return this;
    }

    public remove<T extends CORE_EVENT>(event: T, remove: CocoEventLister<T>): this {

        if (this._eventListeners.has(event)) {

            const listeners: Array<CocoEventLister<T>> = this._eventListeners.get(event) as Array<CocoEventLister<T>>;
            const newListeners: Array<CocoEventLister<T>> = [];
            for (const current of listeners) {
                if (current !== remove) {
                    newListeners.push(current);
                }
            }
            this._eventListeners.set(event, newListeners);
        }
        return this;
    }

    public removeAll<T extends CORE_EVENT>(event: T): this {

        if (this._eventListeners.has(event)) {
            this._eventListeners.set(event, []);
        }
        return this;
    }

    public async emit<T extends CORE_EVENT>(event: T, ...args: CocoEventArgs[T]): Promise<void> {

        if (this._eventListeners.has(event)) {
            const listeners: Array<CocoEventLister<T>> = this._eventListeners.get(event) as Array<CocoEventLister<T>>;
            await Promise.all(listeners.map((listener: CocoEventLister<T>) => listener(...args)));
        }
        return;
    }

    public async go(argv: string[]): Promise<void> {

        const args: string[] = [...argv];

        if (args.length < 2) {
            throw panic.code(ERROR_CODE.INVALID_ARGV, argv.join(' '));
        }

        const environment: string = args.shift() as string;
        const executer: string = args.shift() as string;

        await this.emit(CORE_EVENT.SYSTEM_CALL_INFO, environment, executer);

        if (isCallingRoot(args)) {
            if (this._rootCommand) {
                this._rootCommand.execute(args, this._options);
            }
            return;
        }

        const matched: Command[] = this._marchCommand(args);

        if (matched.length > 1) {
            throw panic.code(ERROR_CODE.MULTIPLE_COMMAND_MATCHED, matched.map((command: Command) => command.simulate).join(', '));
        }

        if (matched.length === 0) {
            await this.emit(CORE_EVENT.FAILED);
            return;
        }

        const firstMatched: Command = _Array.car(matched) as Command;

        await firstMatched.execute(args, this._options);
        await this.emit(CORE_EVENT.SUCCEED);
        return;
    }

    private _marchCommand(argv: string[]): Command[] {

        const commands: Command[] = [];

        for (const command of this._commands) {
            if (command.match(argv)) {
                commands.push(command);
            }
        }

        return commands;
    }
}
