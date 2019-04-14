/**
 * @author WMXPY
 * @namespace Example
 * @description Index
 */

import { Reverse } from "../src";

const reverse = Reverse.create();
reverse.useEnvironmentVariable();

reverse.question('hello', 'TEST').then(console.log);
