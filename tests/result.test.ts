import { Err, None, Ok, Result, Some } from "../src"

function safe() : string {
    return "blah blah blah"
}

function throwable(e: unknown) : never {
    throw e
}

// making sure that the methods that create the Result objects are
// matching the expected types
describe("Can we create different type of results?", () => {
    test("Error result", async () => {
        const errResult = new Err("blah blah blah")

        // try and finally shouldn't work here
        try {
            throwable(errResult.err)
        } catch(e) {
            expect(new Err(e)).toStrictEqual(errResult)
        }
    })
})

describe("Can we convert callback into result?", () => {
    test("From ok sync", () => {
        const expectedOk = new Ok(safe())
        expect(Result.fromSync(safe)).toStrictEqual(expectedOk)
    })

    test("From err sync", () => {
        const errResult = new Err("blah")
        expect(Result.fromSync(() => throwable(errResult.err))).toStrictEqual(errResult)
    })

    test("From ok async", async () => {
        const expectedOk = new Ok(safe())
        const okResult = await Result.fromAsync(async () => safe())
        expect(okResult).toStrictEqual(expectedOk)
    })

    test("From err async", async () => {
        const expectedErr = new Err("blah")
        const errResult = await Result.fromAsync(async () => {throw throwable(expectedErr.err)})
        expect(errResult).toStrictEqual(expectedErr)
    })
})

describe("Can we unwrap a result?", () => {
    test("Unwrap if ok", () => {
        const value = safe()
        expect(Result.fromSync(safe).unwrap()).toBe(value)
    })

    test("Unwrap if err", () => {
        const error = "blah"
        expect(() => (new Err(error)).unwrap()).toThrow(error)
    })

    test("Unwrap or ok", () => {
        const value = safe()
        expect(Result.fromSync(safe).unwrapOr(null)).toBe(value)
    })

    test("Unwrap or err", () => {
        const value = safe()
        expect(Result.fromSync(() => throwable(null)).unwrapOr(value)).toBe(value)
    })

    test("Unwrap or else ok", () => {
        const value = safe()
        expect(Result.fromSync(safe).unwrapOrElse(() => null)).toBe(value)
    })

    test("Unwrap or else err", () => {
        const value = safe()
        expect(Result.fromSync(() => throwable(null)).unwrapOrElse(safe)).toBe(value)
    })
})

describe("Can we convert into an option?", () => {
    test("Non nullable ok into some", () => {
        const value = safe()
        expect(Result.fromSync(safe).okOption()).toStrictEqual(new Some(value))
    })

    test("Nullable ok into option", () => {
        expect(Result.fromSync(() => null).okOption()).toStrictEqual(None)
    })

    test("Err into none", () => {
        expect(Result.fromSync(() => throwable("eee")).okOption()).toStrictEqual(None)
    })

    test("Ok into none", () => {
        expect(Result.fromSync(safe).errOption()).toStrictEqual(None)
    })

    test("Non nullable err into some", () => {
        const err = "blah"
        expect(Result.fromSync(() => throwable(err)).errOption()).toStrictEqual(new Some(err))
    })

    test("Nullable result into none", () => {
        expect(Result.fromSync(() => throwable(null)).errOption()).toStrictEqual(None)
    })
})