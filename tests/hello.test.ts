import { hello } from "../src/index"

test("hello string", () => {
    expect(hello("")).toBe("hello ")
})