/**
 * @author WMXPY
 * @namespace Core
 * @description Option
 */

export class Option {

    public static create(key: string): Option {
        return new Option(key);
    }

    private _name: string | null;
    private _description: string | null;
    private _isBoolean: boolean;

    private readonly _keys: string[];

    private constructor(key: string) {

        this._name = null;
        this._description = null;
        this._isBoolean = false;

        this._keys = [key];
    }

    public get isBoolean(): boolean {
        return this._isBoolean;
    }

    public get description(): string {
        return this._description || '';
    }

    public get name(): string {
        return this._name || this._keys[0];
    }

    public alias(key: string, ...keys: string[]): this {

        this._keys.push(key, ...keys);
        return this;
    }

    public setName(name: string): this {

        this._name = name;
        return this;
    }

    public setDescription(description: string): this {

        this._description = description;
        return this;
    }

    public match(target: string): boolean {

        if (this._keys.some((key: string) => key === target.replace(/-/g, ''))) {
            return true;
        }
        return false;
    }
}
