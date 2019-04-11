/**
 * @author WMXPY
 * @namespace Scenario
 * @description Command
 * @override
 */

import { Sandbox } from "@sudoo/mock";
import { expect } from "chai";
import * as Chance from "chance";
import { Coco, Command } from "../../src";
import { createBarkMockArgs } from "../mock/argv";

describe('Given -Command- coco scenario', (): void => {

    const chance: Chance.Chance = new Chance('scenario-command');

    const first: string = chance.string();
    const firstStack: Sandbox = Sandbox.create();

    const second: string = chance.string();
    const secondStack: Sandbox = Sandbox.create();

    const rootStack: Sandbox = Sandbox.create();

    const coco: Coco = Coco.create();
    coco.rootCommand(Command.root().then(rootStack.func()));
    coco.command(Command.multiple(first, second).then(secondStack.func()));
    coco.command(Command.create(first).then(firstStack.func()));

    it('should be able to trigger first command', async (): Promise<void> => {

        const argv: string[] = createBarkMockArgs(first);

        await coco.go(argv);

        expect(firstStack).to.be.lengthOf(1);
        expect(secondStack).to.be.lengthOf(0);

        firstStack.reset();
        secondStack.reset();
    });

    it('should be able to trigger nested command', async (): Promise<void> => {

        const argv: string[] = createBarkMockArgs(first, second);

        await coco.go(argv);

        expect(firstStack).to.be.lengthOf(0);
        expect(secondStack).to.be.lengthOf(1);

        firstStack.reset();
        secondStack.reset();
    });

    it('should be able to trigger root command', async (): Promise<void> => {

        const argv: string[] = createBarkMockArgs();

        await coco.go(argv);

        expect(rootStack).to.be.lengthOf(1);

        rootStack.reset();
    });
});
