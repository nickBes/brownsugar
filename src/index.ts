interface RawResult {
    ok: boolean
}

export interface OkResult<T> extends RawResult {
    ok: true
    value: T
}

export interface ErrResult extends RawResult {
    ok: false
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