import { expect } from "chai";
import axios from "axios";
import { awaitDelay } from "ystd";

describe(`api.test.ts`, () => {
    it(`var`, async () => {
        await axios({
            method: "post",
            url: "http://localhost:3000/key2",
            data: {
                value: { y: "ha-ha-ha $$testVar.a1$$" },
                ttl: 300,
            },
        });

        const r1 = await axios({
            method: "get",
            url: "http://localhost:3000/key2",
        });
        expect(r1.data).to.deep.equal({ y: "ha-ha-ha aaa" });
    });

    it(`simple`, async () => {
        const makeSampleData = () => {
            return { x: "222aaa" };
        };
        await axios({
            method: "post",
            url: "http://localhost:3000/key3",
            data: {
                value: makeSampleData(),
                ttl: 300,
            },
        });

        const r1 = await axios({
            method: "get",
            url: "http://localhost:3000/key3",
        });
        expect(r1.data).to.deep.equal(makeSampleData());
    });

    it(`ttl`, async () => {
        const makeSampleData = () => {
            return { x: "222aaa" };
        };
        await axios({
            method: "post",
            url: "http://localhost:3000/key123",
            data: {
                value: makeSampleData(),
                ttl: 100,
            },
        });

        const r1 = await axios({
            method: "get",
            url: "http://localhost:3000/key123",
        });
        expect(r1.data).to.deep.equal(makeSampleData());

        await awaitDelay(101);

        const r2 = await axios({
            method: "get",
            url: "http://localhost:3000/key123",
        });
        expect(r2.data).to.deep.equal("");
    });
});
