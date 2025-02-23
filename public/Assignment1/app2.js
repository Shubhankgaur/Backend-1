const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
const querystring = require("querystring");

const port = 3000;
const dataFilePath = path.join(__dirname, "data.json");
const publicDir = path.join(__dirname, "public");

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    const pathname = parsedUrl.pathname;

    if (pathname === "/" && req.method === "GET") {
        // Serve the form.html file
        serveFile(res, path.join(publicDir, "form.html"), "text/html");
    } else if (pathname === "/submit" && req.method === "POST") {
        // Handle form submission
        let body = "";
        req.on("data", chunk => {
            body += chunk.toString();
        });
        req.on("end", () => {
            const formData = querystring.parse(body);
            const newData = {
                firstName: formData.firstName,
                email: formData.email,
                password: formData.password,
            };

            // Read existing data and append new entry
            fs.readFile(dataFilePath, "utf8", (err, data) => {
                if (err && err.code !== "ENOENT") {
                    console.error("Error reading data file:", err);
                    res.statusCode = 500;
                    res.end("Error saving data.");
                    return;
                }

                let jsonData = [];
                if (data) {
                    try {
                        jsonData = JSON.parse(data);
                    } catch (parseErr) {
                        console.error("Error parsing JSON data:", parseErr);
                        res.statusCode = 500;
                        res.end("Error saving data.");
                        return;
                    }
                }

                jsonData.push(newData);

                // Write updated data to the file
                fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), writeErr => {
                    if (writeErr) {
                        console.error("Error writing data file:", writeErr);
                        res.statusCode = 500;
                        res.end("Error saving data.");
                        return;
                    }

                    console.log("Data saved successfully");
                    res.writeHead(302, { Location: "/" });
                    res.end();
                });
            });
        });
    } else if (pathname === "/data" && req.method === "GET") {
        // Serve the data.html file
        serveFile(res, path.join(publicDir, "data.html"), "text/html");
    } else if (pathname === "/data.json" && req.method === "GET") {
        // Serve the data.json file as JSON
        fs.readFile(dataFilePath, "utf8", (err, content) => {
            if (err) {
                if (err.code === "ENOENT") {
                    res.writeHead(404, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "No data available" }));
                } else {
                    console.error("Error reading data file:", err);
                    res.statusCode = 500;
                    res.end("Error retrieving data.");
                }
                return;
            }

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(content);
        });
    } else {
        // Serve static files
        serveStaticFiles(req, res);
    }
});

function serveFile(res, filePath, contentType) {
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.statusCode = 500;
            res.end("Server Error");
            console.error("Error serving file:", err);
            return;
        }
        res.writeHead(200, { "Content-Type": contentType });
        res.end(content);
    });
}

function serveStaticFiles(req, res) {
    const parsedUrl = url.parse(req.url);
    const pathname = parsedUrl.pathname;
    const ext = path.extname(pathname);
    const mimeType = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "application/javascript",
        ".png": "image/png",
        ".jpg": "image/jpeg",
    };

    const filePath = path.join(publicDir, pathname);
    const contentType = mimeType[ext] || "text/plain";

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.statusCode = 404;
            res.end("File Not Found");
            console.error("Error serving static file:", err);
            return;
        }
        res.writeHead(200, { "Content-Type": contentType });
        res.end(content);
    });
}

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
