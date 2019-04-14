/**
 * @author WMXPY
 * @namespace Example
 * @description Index
 */

import { Reverse } from "../src";

const reverse = Reverse.create();

console.log(reverse.isTTY);
reverse.question('hello').then(console.log);
