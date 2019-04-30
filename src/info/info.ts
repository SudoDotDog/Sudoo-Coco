/**
 * @author WMXPY
 * @namespace Info
 * @description Info
 */

import { Command } from "../command/command";
import { Coco } from "../core/coco";

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

    return instance.getCommands().map((command: Command) => {

        return command.arguments.length;
    }).join('\n');
};
