/**
 * @author WMXPY
 * @namespace Info
 * @description Info
 */

import { Coco } from "../coco";
import { Command } from "../command/command";

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
