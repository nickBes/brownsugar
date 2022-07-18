import { SomeOption, some, NoneOption, none, option } from "../src"

function nonNull(): string {
    return "blah blah 2"
}

describe("Can we create different types of options?", () => {
    test("Some option", () => {
        const value = nonNull()
        const expectedSome: SomeOption<typeof value> = {some: true, value: value}
        expect(some(value)).toStrictEqual(expectedSome)
    })

    test("None option", () => {
        const expectedNone: NoneOption = {some: false}
        expect(none()).toStrictEqual(expectedNone)
    })

    test("Option from value", () => {
        const value = nonNull()
        const expectedSome = some(value)
        expect(option(value)).toStrictEqual(expectedSome) 
    })

    test("Option from null", () => {
        const expectedNone = none()
        expect(option(null)).toStrictEqual(expectedNone)
    })

    test("Option from undefined", () => {
        const expectedNone = none()
        expect(option(undefined)).toStrictEqual(expectedNone)
    })
})