interface RawResult {
    readonly ok: boolean
}

export type Nullable<T> = T | null | undefined

function nullish<T>(val: Nullable<T>): boolean {
    return val == null || val == undefined
}

export class Ok<T> implements RawResult {
    readonly ok = true
    value: T
    
    constructor(value: T) {
        this.value = value
    }

    unwrap(): T {
        return this.value
    }

    unwrapOr<T2>(_: T2): T | T2 {
        return this.value
    }

    unwrapOrElse<T2>(_: (value: T) => T2): T {
        return this.value
    }
}

export class Err implements RawResult {
    readonly ok = false
    err: unknown

    constructor(err: unknown) {
        this.err = err
    }

    unwrap(): never {
        throw this.err
    }

    unwrapOr<T2>(value: T2): T2 {
        return value
    }

    unwrapOrElse<T2>(callback: (_?: unknown) => T2): T2 {
        return callback(this.err)
    }
}

export type ResultType<T> = Ok<T> | Err

export namespace Result {
    export function fromSync<T>(callback: () => T): ResultType<T> {
        try {
            const value = callback()
            return new Ok(value)
        } catch(e) {
            return new Err(e)
        }
    }

    export async function fromAsync<T>(callback: () => Promise<T>): Promise<ResultType<T>> {
        try {
            const value = await callback()
            return new Ok(value)
        } catch(e) {
            return new Err(e)
        }
    }
}

type MapCallback<T, K> = (value: T) => K | null

// define global array methods
declare global {
    interface Array<T> {
        // returns the values from result array
        getOk<U>(this: Array<ResultType<U>>): U[]

        // returns the errros from result array
        getErrors<U>(this: Array<ResultType<U>>): unknown[]

        // returns the values from an option array
        getSome<U>(this: Array<any>): NonNullable<U>[]

        // maps each element using a MapCallback and return the elements
        // which are the values of the return Some type
        filterMap<U>(callback: MapCallback<T, U>): NonNullable<U>[]

        // same as filter map but it returns the value of the first Some
        findMap<U>(callback: MapCallback<T, U>): T | null
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

Array.prototype.getSome = function getSome<U>(this: Array<Nullable<U>>) : NonNullable<U>[] {
    return this.
                filter((opt): opt is NonNullable<U> => !nullish(opt))
}

Array.prototype.filterMap = function filterMap<U>(callback: MapCallback<any, U>): NonNullable<U>[] {
    return this
                .map((value) => callback(value))
                .getSome()
}

Array.prototype.findMap = function findMap<U>(callback: MapCallback<any, U>): Nullable<U> {
    return this.filterMap(callback)[0]
}