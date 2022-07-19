interface RawResult {
    readonly ok: boolean
}

interface Unwrapable<T> {
    unwrap: () => T
}

export class Ok<T> implements RawResult, Unwrapable<T> {
    readonly ok = true
    value: T
    
    constructor(value: T) {
        this.value = value
    }

    unwrap(): T {
        return this.value
    }
}

export class Err implements RawResult, Unwrapable<never> {
    readonly ok = false
    err: unknown

    constructor(err: unknown) {
        this.err = err
    }

    unwrap(): never {
        throw this.err
    }
}

export type ResultType<T> = Ok<T> | Err

export namespace Result {
    type ThrowableCallback<T> = () => Promise<T> | T | never

    export function from<T>(callback: ThrowableCallback<T>): ResultType<T> | Promise<ResultType<T>> {
        try {
            const returned = callback()
    
            // if the callback is async return an async result
            if (returned instanceof Promise) {
                return returned
                            .then(val => new Ok(val))
                            .catch(e => new Err(e))
            } 
            return new Ok(returned)
        } catch(e) {
            return new Err(e)
        }
    }
}

interface RawOption {
    readonly some: boolean
}

export class Some<T> implements RawOption {
    readonly some = true
    value: NonNullable<T>

    constructor(value: NonNullable<T>) {
        this.value = value
    }

    unwrap(): NonNullable<T> {
        return this.value
    }
}

export const None: Unwrapable<null> & RawOption = {
    some: false,
    unwrap: () => null
}

export type OptionType<T> = Some<T> | typeof None

export namespace Option {
    export function from<T>(value: T): OptionType<T> {
        if (value === undefined || value === null) {
            return None
        }
        // we're checking that value is not null nor undefined
        // hence, we can cast it into NonNullable<T>
        return new Some(value as NonNullable<T>)    
    }
}

type MapCallback<T, K> = (value: T) => OptionType<K>

// define global array methods
declare global {
    interface Array<T> {
        // returns the values from result array
        getOk<U>(this: Array<ResultType<U>>): U[]

        // returns the errros from result array
        getErrors<U>(this: Array<ResultType<U>>): unknown[]

        // returns the values from an option array
        getSome<U>(this: Array<OptionType<U>>): NonNullable<U>[]

        // maps each element using a MapCallback and return the elements
        // which are the values of the return Some type
        filterMap<U>(callback: MapCallback<T, U>): NonNullable<U>[]

        // same as filter map but it returns the value of the first Some
        findMap<U>(callback: MapCallback<T, U>): OptionType<U>
    }

    interface Promise<T> {
        unwrap<U>(this: Promise<ResultType<U>>): Promise<U>
    }
}

// For some reason defining prototypes doesnt work 
// with arrow functions so I have to define a regular.

Array.prototype.getOk = function getOk<U>(this: Array<ResultType<U>>): U[] {
    return this
                .filter((res): res is Ok<U> => res.ok)
                .map(k => k.value)
}

Array.prototype.getErrors = function getErrors<U>(this: Array<ResultType<U>>): unknown[] {
    return this
                .filter((res): res is Err => !res.ok)
                .map(e => e.err)
}

Array.prototype.getSome = function getSome<U>(this: Array<OptionType<U>>) : NonNullable<U>[] {
    return this.
                filter((opt): opt is Some<U> => opt.some)
                .map(s => s.value)
}

Array.prototype.filterMap = function filterMap<U>(callback: MapCallback<any, U>): NonNullable<U>[] {
    return this
                .map((value) => callback(value))
                .getSome()
}

Array.prototype.findMap = function findMap<U>(callback: MapCallback<any, U>): OptionType<U> {
    return Option.from(this.filterMap(callback)[0])
}

Promise.prototype.unwrap = async function unwrap<U>(this: Promise<ResultType<U>>): Promise<U> {
    return (await this).unwrap()
}