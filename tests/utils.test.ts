import { Ok, Err, Nullable } from "../src"

describe("Array methods", () => {
    test("Get some", () => {
        const arr: Array<Nullable<string | number>> = ["nla", 123, null, undefined]
        expect(arr.getSome()).toStrictEqual(["nla", 123])
    })

    test("Get ok", () => {
        const arr = [new Ok("dwd"), new Ok(123), new Err("eeeee")]
        expect(arr.getOk<string | number>()).toStrictEqual(["dwd", 123])
    })

    test("Get err", () => {
        const arr = [new Err("blah"), new Ok(123), new Err("eee")]
        expect(arr.getErrors()).toStrictEqual(["blah", "eee"])
    })

    test("Filter map", () => {
        const arr = ["a", "1", "23", "b"]
        let numbers = arr.filterMap((val) => {
            let parsed = parseInt(val)
            if (isNaN(parsed)) {
                return null
            }
            return parsed
        })
        expect(numbers).toStrictEqual([1, 23])
    })

    test("Find map", () => {
        const arr = [1, 2, 3]
        const expectedSome = 2
        expect(arr.findMap(val => val % 2 == 0 ? val : null)).toStrictEqual(expectedSome)
    })
})