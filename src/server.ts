import express from "express";
import { readFileSync } from "fs";
import { parse } from "json5";
// @ts-ignore
import objectPath from "object-path";

interface ServerSettings {
    port: number;
    varDelimiter?: string;
    vars?: any;
}

export function readSettings(): ServerSettings {
    const settings = Object.assign({ port: 3000, vars: {} }, parse(readFileSync("settings.json", "utf-8")));
    return settings;
}

export function startServer(settings: ServerSettings = readSettings()) {
    const port = settings.port;

    const app = express();
    app.use(express.json());

    const runtimeStore: any = {};
    const timers: any = {};

    app.get("/:key", (req, res) => {
        const key = req.params.key || "";
        res.send(runtimeStore[key] || "");
    });

    const varDelimiter = settings.varDelimiter || "$$";

    app.post("/:key", function (req, res) {
        const key = req.params.key || "";
        let { ttl, value } = req.body;
        const valueStr = JSON.stringify(value);
        if (valueStr.includes(varDelimiter)) {
            const items = valueStr.split(varDelimiter);
            for (let i = 1; i < items.length; i += 2) {
                const varPath = items[i];
                const v = objectPath.get(settings.vars, varPath);
                const vStr = v; //JSON.stringify(v);
                items[i] = vStr;
            }
            runtimeStore[key] = items.join("");
        } else {
            runtimeStore[key] = value;
        }
        if (ttl) {
            if (timers[key]) {
                clearTimeout(timers[key]);
                delete timers[key];
            }

            if (value !== undefined) {
                timers[key] = setTimeout(() => {
                    delete runtimeStore[key];
                    delete timers[key];
                }, ttl);
            }
        }
        //console.log(req.body); // your JSON
        res.send({ ok: true });
    });

    app.listen(port, () => {
        console.log(`RuntimeDataStore is listening at port ${port}`);
    });
}
