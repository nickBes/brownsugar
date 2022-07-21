import { Some, None, Option } from "../src"

function nonNull(): string {
    return "blah blah 2"
}

describe("Can we create different types of options?", () => {
    test("Option from value", () => {
        const value = nonNull()
        const expectedSome = new Some(value)
        expect(Option.from(value)).toStrictEqual(expectedSome) 
    })

    test("Option from null", () => {
        const expectedNone = None
        expect(Option.from(null)).toStrictEqual(expectedNone)
    })

    test("Option from undefined", () => {
        const expectedNone = None
        expect(Option.from(undefined)).toStrictEqual(expectedNone)
    })
})

describe("Can we unwrap an option?", () => {
    test("Unwrap from some", () => {
        const value = "blah"
        expect(Option.from(value).unwrap()).toBe(value)
    })

    test("Unwrap from null", () => {
        expect(Option.from(null).unwrap()).toBe(null)
    })
})