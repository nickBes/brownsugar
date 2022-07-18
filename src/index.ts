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