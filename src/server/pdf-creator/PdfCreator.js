
import fs from "fs";
import path from "path";

import { PassThrough } from "stream";
import { fork } from "child_process";

export default class PdfCreator {

    async getPdfStream(templatePath, context) {

        var options = {
            format: "A4"
        };

        return new Promise((resolve, reject) => {

            const childProcessOptions = {
                stdio: [0, 1, 2, "ipc", "pipe", "pipe"]
            };

            const child = fork(path.resolve(__dirname, "CreateStream"), [options, templatePath], childProcessOptions);

            var childInputStream = child.stdio[4];
            var childOutputStream = child.stdio[5];

            var contextString = JSON.stringify(context);

            var Readable = require('stream').Readable;

            var s = new Readable;
            s.push(contextString);
            s.push(null);

            s.pipe(childInputStream);

            resolve(childOutputStream);

        });

    }

}
