import { ErrResult, ok, err, OkResult, intoResult } from "../src"

function safe() : string {
    return "blah blah blah"
}

function throwable(e: unknown) : never {
    throw e
}

// making sure that the methods that create the Result objects are
// matching the expected types
describe("Can we create different type of results?", () => {
    test("Ok result", () => {
        const value = safe()
        const expectedOk : OkResult<typeof value> = {ok: true, value}
        expect(ok(value)).toStrictEqual(expectedOk)
    })

    test("Error result", async () => {
        const errResult : ErrResult = {ok: false, err: "blah blah blah"}

        // try and finally shouldn't work here
        try {
            throwable(errResult.err)
        } catch(e) {
            expect(err(e)).toStrictEqual(errResult)
        }
    })
})

describe("Can we convert callback into result?", () => {
    test("From ok sync", () => {
        const expectedOk = ok(safe())
        expect(intoResult(safe)).toStrictEqual(expectedOk)
    })

    test("From err sync", () => {
        const errResult = err("blah")
        expect(intoResult(() => throwable(errResult.err))).toStrictEqual(errResult)
    })

    test("From ok async", async () => {
        const expectedOk = ok(safe())
        const okResult = await intoResult(async () => safe())
        expect(okResult).toStrictEqual(expectedOk)
    })

    test("From err async", async () => {
        const expectedErr = err("blah")
        const errResult = await intoResult(async () => {throw throwable(expectedErr.err)})
        expect(errResult).toStrictEqual(expectedErr)
    })
})