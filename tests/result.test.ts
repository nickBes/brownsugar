import { Err, Ok, Result } from "../src"

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
        expect(Result.from(safe)).toStrictEqual(expectedOk)
    })

    test("From err sync", () => {
        const errResult = new Err("blah")
        expect(Result.from(() => throwable(errResult.err))).toStrictEqual(errResult)
    })

    test("From ok async", async () => {
        const expectedOk = new Ok(safe())
        const okResult = await Result.from(async () => safe())
        expect(okResult).toStrictEqual(expectedOk)
    })

    test("From err async", async () => {
        const expectedErr = new Err("blah")
        const errResult = await Result.from(async () => {throw throwable(expectedErr.err)})
        expect(errResult).toStrictEqual(expectedErr)
    })
})

describe("Can we unwrap a result?", () => {
    test("Unwrap if ok", () => {
        const value = safe()
        expect(Result.from(safe).unwrap())
    })
})