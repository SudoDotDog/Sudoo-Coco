/**
 * @author WMXPY
 * @namespace Core
 * @description Option
 */

export class Option {

    public static create(...keys: string[]): Option {
        return new Option(...keys);
    }

    private _name: string | null;
    private _description: string | null;
    private _isBoolean: boolean;
    private _isOptional: boolean;

    private readonly _keys: string[];

    private constructor(...keys: string[]) {

        this._name = null;
        this._description = null;
        this._isBoolean = false;
        this._isOptional = true;

        this._keys = keys;
    }

    public get isBoolean(): boolean {
        return this._isBoolean;
    }

    public get isValue(): boolean {
        return !this._isBoolean;
    }

    public get isOptional(): boolean {
        return this._isOptional;
    }

    public get isRequired(): boolean {
        return !this._isOptional;
    }

    public get description(): string {
        return this._description || '';
    }

    public get name(): string {
        return this._name || this._keys[0];
    }

    // eslint-disable-next-line id-blacklist
    public boolean(): this {

        this._isBoolean = true;
        return this;
    }

    public optional(): this {

        this._isOptional = true;
        return this;
    }

    public required(): this {

        this._isOptional = false;
        return this;
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
