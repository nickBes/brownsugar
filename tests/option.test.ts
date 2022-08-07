import { Some, None, Option, Ok, Err } from "../src"

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

    test("Unwrap or some", () => {
        const value = nonNull()
        expect(Option.from(value).unwrapOr("")).toBe(value)
    })

    test("Unwrap or none", () => {
        const value = nonNull()
        expect(Option.from(null).unwrapOr(value)).toBe(value)
    })

    test("Unwrap or else some", () => {
        const value = nonNull()
        expect(Option.from(value).unwrapOrElse(nonNull)).toBe(value)
    })

    test("Unwrap or else none", () => {
        expect(Option.from(null).unwrapOrElse(nonNull)).toBe(nonNull())
    })
})

describe("Can we convert into result?", () => {
    test("Some into ok", () => {
        const value = nonNull()
        expect(Option.from(value).okOr("Got null")).toStrictEqual(new Ok(value))
    })

    test("None into err", () => {
        const err = "Recieved nullable type"
        expect(Option.from(null).okOr(err)).toStrictEqual(new Err(err))
    })
})