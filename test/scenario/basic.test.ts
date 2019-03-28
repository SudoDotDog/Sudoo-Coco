/**
 * @author WMXPY
 * @namespace Scenario
 * @description Basic
 * @override
 */

import { Sandbox } from "@sudoo/mock";
import { expect } from "chai";
import * as Chance from "chance";
import { Coco, Command } from "../../src";
import { createBarkMockArgs } from "../mock/argv";

describe('Given -Basic- coco scenario', (): void => {

    const chance: Chance.Chance = new Chance('scenario-basic');

    const commandName: string = chance.string();
    const commandStack: Sandbox = Sandbox.create();

    const coco: Coco = Coco.create();
    coco.command(Command.create(commandName).then(commandStack.func()));

    it('should be able to trigger command', async (): Promise<void> => {

        const argv: string[] = createBarkMockArgs(commandName);

        await coco.go(argv);

        expect(commandStack).to.be.lengthOf(1);
    });
});
