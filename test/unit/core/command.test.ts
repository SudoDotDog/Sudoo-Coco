/**
 * @author WMXPY
 * @namespace Core
 * @description Command
 * @override
 */

import { expect } from "chai";
import * as Chance from "chance";
import { Argument } from "../../../src/core/argument";
import { Command } from "../../../src/core/command";
import { ERROR_CODE, panic } from "../../../src/panic/declare";

describe('Given {Command} class', (): void => {

    const chance: Chance.Chance = new Chance('core-command');

    it('should be able to create', (): void => {

        const name: string = chance.string();
        const command: Command = Command.create(name);

        expect(command).to.be.instanceOf(Command);
    });

    it('should be able to parse arguments', (): void => {

        const name: string = chance.string();
        const command: Command = Command.create(name);

        const arg: string = chance.string();
        const value: string = chance.string();

        command.argument(Argument.create(arg));

        expect(command.parseArgs([value])).to.be.deep.equal({
            [arg]: value,
        });
    });

    it('should be able to parse optional arguments', (): void => {

        const name: string = chance.string();
        const command: Command = Command.create(name);

        const arg: string = chance.string();

        command.argument(Argument.create(arg).optional());

        expect(command.parseArgs([])).to.be.deep.equal({});
    });

    it('should be able to throw when too many args', (): void => {

        const name: string = chance.string();
        const command: Command = Command.create(name);

        const arg: string = chance.string();
        const value: string = chance.string();

        command.argument(Argument.create(arg));

        const run = () => {
            command.parseArgs([value, chance.string()]);
        };

        expect(run).to.be.throw(panic.code(ERROR_CODE.TOO_MANY_ARGUMENTS).message);
    });

    it('should be able to throw when too insufficient args', (): void => {

        const name: string = chance.string();
        const command: Command = Command.create(name);

        const arg: string = chance.string();
        const value: string = chance.string();

        command.argument(Argument.create(arg));

        const run = () => {
            command.parseArgs([]);
        };

        expect(run).to.be.throw(panic.code(ERROR_CODE.INSUFFICIENT_ARGUMENTS).message);
    });
});
