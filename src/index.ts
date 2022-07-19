interface RawResult {
    readonly ok: boolean
}

export interface OkResult<T> extends RawResult {
    readonly ok: true
    value: T
}

export interface ErrResult extends RawResult {
    readonly ok: false
    err: unknown
}

export type Result<T> = OkResult<T> | ErrResult

export function ok<T>(value: T): OkResult<T> {
    return {ok: true, value}
}

export function err(err: unknown): ErrResult {
    return {ok: false, err}
}

export type ThrowableCallback<T> = () => Promise<T> | T | never

export function intoResult<T>(callback: ThrowableCallback<T>): Result<T> | Promise<Result<T>> {
    try {
        const returned = callback()

        // if the callback is async return an async result
        if (returned instanceof Promise) {
            return returned
                        .then(val => ok(val))
                        .catch(e => err(e))
        } 
        return ok(returned)
    } catch(e) {
        return err(e)
    }
}

interface RawOption {
    readonly some: boolean
}

export interface SomeOption<T> extends RawOption {
    readonly some: true
    value: NonNullable<T>
}

export interface NoneOption extends RawOption {
    readonly some: false
}

export type Option<T> = SomeOption<T> | NoneOption

export function some<T>(value: NonNullable<T>): SomeOption<T> {
    return {some: true, value}
}

export function none(): NoneOption {
    return {some: false}
}

export function option<T>(nullable: NonNullable<T> | undefined | null): Option<T> {
    if (nullable == undefined || nullable == null) {
        return none()
    }
    return some(nullable)
}

type MapCallback<T, K> = (value: T) => Option<K>

// define global array methods
declare global {
    interface Array<T> {

        // returns the values from result array
        getOk<U>(this: Array<Result<U>>): U[]

        // returns the errros from result array
        getErrors<U>(this: Array<Result<U>>): unknown[]

        // returns the values from an option array
        getSome<U>(this: Array<Option<U>>): NonNullable<U>[]

        // maps each element using a MapCallback and return the elements
        // which are the values of the return SomeOption type
        filterMap<U>(callback: MapCallback<T, U>): NonNullable<U>[]

        // same as filter map but it returns the value of the first SomeOption
        findMap<U>(callback: MapCallback<T, U>): Option<U>
    }
}

// For some reason defining prototypes doesnt work 
// with arrow functions so I have to define a regular.

Array.prototype.getOk = function getOk<U>(this: Array<Result<U>>): U[] {
    return this
                .filter((res): res is OkResult<U> => res.ok)
                .map(k => k.value)
}

Array.prototype.getErrors = function getErrors<U>(this: Array<Result<U>>): unknown[] {
    return this
                .filter((res): res is ErrResult => !res.ok)
                .map(e => e.err)
}

Array.prototype.getSome = function getSome<U>(this: Array<Option<U>>) : NonNullable<U>[] {
    return this.
                filter((opt): opt is SomeOption<U> => opt.some)
                .map(s => s.value)
}

Array.prototype.filterMap = function filterMap<U>(callback: MapCallback<any, U>): NonNullable<U>[] {
    return this
                .map((value) => callback(value))
                .getSome()
}

Array.prototype.findMap = function findMap<U>(callback: MapCallback<any, U>): Option<U> {
    return option(this.filterMap(callback)[0])
}