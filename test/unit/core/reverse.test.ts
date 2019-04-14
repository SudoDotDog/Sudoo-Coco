/**
 * @author WMXPY
 * @namespace Core
 * @description Reverse
 * @override
 */

import { expect } from "chai";
import * as Chance from "chance";
import { Reverse } from "../../../src/core/reverse";

describe('Given {Reverse} class', (): void => {

    const chance: Chance.Chance = new Chance('core-reverse');

    it('should be able to create', (): void => {

        const reverse: Reverse = Reverse.create(chance.string() as any);

        expect(reverse).to.be.instanceOf(Reverse);
    });
});
