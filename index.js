const fs = require("fs");
const http = require("http");
const { URL } = require("url");
const querystring = require("querystring");

const hostname = "127.0.0.1";
const port = 8000;

const overviewData = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8");
const cardData = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8");
const productData = fs.readFileSync(`${__dirname}/templates/template-product.html`, "utf-8");
const apiData = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");

const data = JSON.parse(apiData);

const replaceTemplate = (template, product) => {
    let output = template.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);
    if (!product.organic) {
        output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
    }
    return output;
};

const server = http.createServer((req, res) => {
    // OLD METHOD
    // parse method return an object containing url properties
    // query property returns an onject with all query string parameters as properties
    // const { query, pathname } = url.parse(req.url, true);

    // NEW METHOD
    // const baseURL = req.protocol + "://" + req.headers.host + "/";
    const baseURL = `http://${req.headers.host}`;
    // reqURL variable contains absolute url. Here it is http://localhost:8000/product?id=0
    // new URL(input, base);
    // input -> a string that indicates input URL to parse(parse means splitting the url string into its components). When the URL string is parsed, a URL object that contains properties for each of these components is returned.
    // now the components include href, protocol, username, password, host, hostname, port, path, query, searchParams etc.
    // bsae -> a string or a URL specified as a string, which indicates the Base URL to resolve against if the input URL is not absolute. This parameter is optional.
    // The new URL() API creates a URL object by parsing the input URL relative to the base URL. If the base URL is passed as a string, it is parsed equivalent to the new URL(base) API.
    const reqURL = new URL(req.url, baseURL);
    // to get the pathname of the url we access the pathname property of reqURL object.
    const pathname = reqURL.pathname;

    const query = {};
    for (const [key, val] of reqURL.searchParams.entries()) {
        query[key] = val;
    }

    // Overview Page
    if (pathname === "/" || pathname === "/overview") {
        res.writeHead(200, { "Content-Type": "text/html" });
        const card = data.map((e) => replaceTemplate(cardData, e)).join("");
        const output = overviewData.replace(/{%PRODUCT_CARD%}/g, card);
        res.end(output);

        // Product Page
    } else if (pathname === "/product") {
        res.writeHead(200, { "Content-Type": "text/html" });
        const product = data[query.id];
        const output = replaceTemplate(productData, product);
        res.end(output);

        // API Page
    } else if (pathname === "/api") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(apiData);

        // Not Found Page
    } else {
        res.writeHead(404, { "Content-type": "text/html" });
        res.end("<h2>Page not found</h2>");
    }
});
server.listen(port, hostname, (err, res) => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

// // FILE SYSTEM -> fs module
// // we get access to the file system on your computer.
// // we can:
// // 1. Read File
// // 2. Create File
// // 3. Update File
// // 4. Delete File
// // 5. Rename File
// // this will return an onject which has lot of functions and we store that
// // object in the fs variable.
// const fs = require("fs");

// const textRead = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textRead);

// const textWrite = `This is what we know about the avaocado: ${textRead}. \nCreated on ${Date.now()}`;
// // this does not return anything meaningful so we don't store it anywhere in the variable.
// fs.writeFileSync("./txt/output.txt", textWrite, "utf-8");

// create a server object
// the callback function is called each time a new request hits the server
// the callback function will run as soon as the server starts listening.
// we started listening incoming request on ip address 127.0.0.1 and port
// 8000. 127.0.0.1 is the ip address of localhost

// api is a service from which we can request data.
// . refers to the directory from which we run node command in the terminal. (where the script is running)
// __dirname translates to the directory in which the script that we are current excuting is located.
// HTTP status codes indicate whether a request has been successful or not or if it has been re-directed.

// __dirname in node script returns the path to the folder where your current executing script is located.
// ./ refers to the current working directory. current working directory is the path of the folder where the node command is executed.
// for eg: /dir1/dir2/index.js -> consider index.js as you script
// now if you ran this from dir1 i.e node dir2/index.js
// then __dirname would give /dir1/dir2 because this is location of my script index.js
// but ./ would /dir1 because /dir1 is my current working directory.
// The only case when ./ gives the path of the currently executing file is when it is used with the require() command which works relative
// to the current working directory. The ./ allows us import modules based on file structure.

// slug is basically the last part of the url that contains a unique string that identifies the resource that the website is displaying
