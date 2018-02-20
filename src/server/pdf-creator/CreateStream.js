var pdf = require("html-pdf");
var fs = require("fs");
var pdf = require("html-pdf");
var handlebars = require("handlebars");
var path = require("path");

var options = process.argv[2];
var templatePath = process.argv[3];

var contextReadStream = fs.createReadStream(null, { fd: 4 });
var writeStream = fs.createWriteStream(null, { fd: 5 });

var contextString = null;

readContext(contextReadStream).then(function (contextString) {

    var context = JSON.parse(contextString);
    var source = fs.readFileSync(templatePath, "utf8");
    var template = handlebars.compile(source);
    var html = template(context);

    html = html.replace(/%ASSETS_PATH%/g, path.resolve(__dirname, "pdf-assets") + path.sep);

    pdf.create(html).toStream((error, stream) => {
        if (error) {
            throw error;
        }

        stream.pipe(writeStream);

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

