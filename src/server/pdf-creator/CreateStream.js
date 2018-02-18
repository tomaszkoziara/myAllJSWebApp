var pdf = require("html-pdf");
var fs = require("fs");
var pdf = require("html-pdf");
var handlebars = require("handlebars");
var path = require("path");

// var html = process.argv[2];
var options = process.argv[2];
var templatePath = process.argv[3];

console.log("Forked process!");
// console.log(process);
var contextReadStream = fs.createReadStream(null, { fd: 4 });
var writeStream = fs.createWriteStream(null, { fd: 5 });

// var contextString = contextReadStream.read();
var contextString = null;
readContext(contextReadStream).then(function (contextString) {
    console.log(contextString);
    var context = JSON.parse(contextString);


    var source = fs.readFileSync(templatePath, "utf8");
    var template = handlebars.compile(source);
    var html = template(context);

    console.log(context);

    html = html.replace(/%ASSETS_PATH%/g, path.resolve(__dirname, "pdf-assets") + path.sep);

    pdf.create(html).toStream((error, stream) => {
        if (error) {
            throw error;
        }

        console.log("Got stream!!");
        // console.log("----------------------------");
        // console.log(stream);
        // console.log("----------------------------");
        // console.log(outputStream);
        // console.log("----------------------------");

        // stream.pipe(outputStream);
        // process.send(stream);
        stream.pipe(writeStream);

        // outputStream.on('error', function () {
        //     console.error('All writes are now complete.');
        // });
        // outputStream.end('This is the end\n');
        // outputStream.on('finish', function () {
        //     console.error('All writes are now complete.');
        // });
    });


});

function readContext(contextReadStream) {

    return new Promise(function (resolve, reject) {

        var contextString = "";

        contextReadStream.on("data", function (chunk) {

            contextString += chunk;

        });

        contextReadStream.on("error", function (error) {

            if (error.code === "EOF") {
                resolve(contextString);
                contextReadStream.close();
            } else {
                reject(error);
            }

        });

    });

}

