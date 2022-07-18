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

type FilterMapCallback<T> = (value: T, index: number) => Option<any>
type FilterMap<T> = (callback: FilterMapCallback<T>) => NonNullable<any>

// define global array methods
// important !!! 
// because you can pass generics once here, additional types that are
// based on other generics will be declared with any
declare global {


    interface Array<T extends Option<any>> {
        // returns array of some values
        get_some: () => NonNullable<any>[]
    }

    interface Array<T> {
        // like rust's filter map
        filter_map: FilterMap<T>
    }
}

// For some reason defining prototypes doesnt work 
// with arrow functions so I have to define a regular.

Array<Option<any>>.prototype.get_some = function get_some(): NonNullable<any>[] {
    // method is defined on arrays of T which extends Option<any>
    // which means we can cast "this" from any[] into Option<any>[]
    return (this as Option<any>[])
            .filter((val): val is SomeOption<any> => val.some)
            .map(s => s.value)
}

Array.prototype.filter_map = function filter_map<T>(callback: FilterMapCallback<T>): NonNullable<any>[] {
    return this
            .map((value, index) => callback(value, index))
            .get_some()
}