import { none, some } from "../src"

describe("Array methods", () => {
    test("Filter map", () => {
        const arr = ["a", "1", "23", "b"]
        let numbers: number[] = arr.filter_map((val) => {
            let parsed = parseInt(val)
            if (isNaN(parsed)) {
                return none()
            }
            return some(parsed)
        })
        expect(numbers).toStrictEqual([1, 23])
    })

    test("Get some", () => {
        const arr = [some("eee"), some(111), none(), none()]
        expect(arr.get_some()).toStrictEqual(["eee", 111])
    })
})