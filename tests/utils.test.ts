import { none, some, Option, ok, err } from "../src"

describe("Array methods", () => {
    test("Get some", () => {
        const arr: Array<Option<string | number>> = [some("nla"), some(123), none(), none()]
        expect(arr.getSome()).toStrictEqual(["nla", 123])
    })

    test("Get ok", () => {
        const arr = [ok("dwd"), ok(123), err("eeeee")]
        expect(arr.getOk<string | number>()).toStrictEqual(["dwd", 123])
    })

    test("Get err", () => {
        const arr = [err("blah"), ok(123), err("eee")]
        expect(arr.getErrors()).toStrictEqual(["blah", "eee"])
    })

    test("Filter map", () => {
        const arr = ["a", "1", "23", "b"]
        let numbers = arr.filterMap((val) => {
            let parsed = parseInt(val)
            if (isNaN(parsed)) {
                return none()
            }
            return some(parsed)
        })
        expect(numbers).toStrictEqual([1, 23])
    })

    test("Find map", () => {
        const arr = [1, 2, 3]
        const expectedSome = some(2)
        expect(arr.findMap(val => val % 2 == 0 ? some(val) : none())).toStrictEqual(expectedSome)
    })
})