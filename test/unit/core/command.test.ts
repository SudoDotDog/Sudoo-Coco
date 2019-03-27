/**
 * @author WMXPY
 * @namespace Core
 * @description Command
 * @override
 */

import { expect } from "chai";
import * as Chance from "chance";
import { Command } from "../../../src/core/command";

describe('Given {Command} class', (): void => {

    const chance: Chance.Chance = new Chance('core-command');

    it('should be able to create', (): void => {

        const name: string = chance.string();
        const command: Command = Command.create(name);

        expect(command).to.be.instanceOf(Command);
    });
});
