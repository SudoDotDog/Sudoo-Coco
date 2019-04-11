/**
 * @author WMXPY
 * @namespace Info
 * @description Info
 */

import { Coco } from "../core/coco";
import { Command } from "../core/command";

export const createInfoCommand = (
    command: string,
    coco: Coco,
    printFunction: (result: string) => void,
): Command => {

    return Command.create(command).then(() => {
        printFunction(parseInfo(coco));
    });
};

export const parseInfo = (instance: Coco): string => {

    return instance.getCommands().toString();
};
