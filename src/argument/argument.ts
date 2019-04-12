/**
 * @author WMXPY
 * @namespace Core
 * @description Argument
 */

export class Argument {

    public static create(name: string): Argument {
        return new Argument(name);
    }

    private readonly _name: string;

    private _description: string | null;
    private _isOptional: boolean;

    private constructor(name: string) {

        this._name = name;
        this._description = null;
        this._isOptional = false;
    }

    public get isOptional(): boolean {

        return this._isOptional;
    }

    public get description(): string {

        return this._description || '';
    }

    public get name(): string {

        return this._name;
    }

    public setDescription(description: string): this {

        this._description = description;
        return this;
    }

    public optional(): this {

        this._isOptional = true;
        return this;
    }
}
