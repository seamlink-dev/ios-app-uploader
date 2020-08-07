const express = require('express');
const skipper = require('skipper');
const targz = require('targz');
const path = require('path');
const fs = require('fs-extra');
const exec = require('child_process').execFile;

const app = express();
let port = 7890;

const getDate = () => { return new Date().toISOString().slice(0,16); }

app.post('/upload', skipper());
app.post('/upload', function (req, res) {
    req.setTimeout(1000000);
    const body = req.body || {};

    const options = {
        dirname: path.join(__dirname, (body.dirname || '')),
        saveAs: body.fileName,
        maxBytes: 50 * 1024 * 1024
    };

    const setLogMessage = (msg) => {
	return body.dirname + " -> " + getDate() + " -> " + msg;
    }

    console.log(setLogMessage("New upload request for " + body.dirname));
    fs.rmdirSync(options.dirname, { recursive: true });    //fs.emptyDirSync(options.dirname);

    req.file('file').upload(options, function (err, uploadedFiles) {
        if (err) {
            console.log(setLogMessage(JSON.stringify(err)));
            return res.status(500).send(err.toString());
        } else {
            console.log(setLogMessage("Saved package"));
            res.send('successfully!');

            if (uploadedFiles) {
                console.log(setLogMessage("Unziping package..."));
                uploadedFiles.forEach(file => {
                    //console.log(file);
                    targz.decompress({
                        src: file.fd,
                        dest: options.dirname
                    }, function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(setLogMessage("Unzipping done!"));
                            console.log(setLogMessage("Starting npm install..."));
                            var yourscript = exec('./buildapp.command',[body.dirname],{ shell: true, maxBuffer: 100 * 1024 * 1024},
                                (error, stdout, stderr) => {
                                    console.log(setLogMessage(stdout));
                                    console.log(setLogMessage(stderr));
                                    if (error !== null) {
                                        console.log(`exec error: ${error}`);
                                    }
				    else {
                            		console.log(setLogMessage("App ready at folder " + body.dirname));
                                    }
                                });
                        }
                    });
                });
            }
        }
    });
});

app.options.limit = 24 * 1024 * 1024;
app.listen(port, function () {
    port = (port !== '80' ? ':' + port : '');
    var url = 'http://localhost' + port + '/';
    console.log('Running at ' + url);
});

/*const http = require('http');
const fs = require('fs');
const targz = require('targz');

const hostname = '127.0.0.1';
const port = 3000;
const basePath = __dirname;

http.createServer(function (req, res) {
    var body = [];
    req.on('error', (err) => {
        console.error(err);
    }).on('data', (chunk) => {
        console.log('x');
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body);
        var path = basePath + req.url + "/";

        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
        else {
            fs.readdir(path, (err, files) => {
                if (err) throw err;

                for (const file of files) {
                    fs.unlink(path + file, err => {
                        if (err) throw err;
                    });
                }
            });
        }

        const fileNamePath = path + "filename.tgz";
        fs.open(fileNamePath, "wx", (err, fd) => {
            if (err) {
                if (err.code === 'EEXIST') {
                    console.error(' already exists');
                    return;
                }

                throw err;
            }

            fs.write(fd, body, (err) => {
                if (err) {
                    console.log(JSON.stringify(err));
                }
                else {
                    console.log("Upload successfull!");

                    // decompress files from tar.gz archive
                    targz.decompress({
                        src: fileNamePath,
                        dest: path
                    }, function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("Extract done!");
                        }
                    });
                }
            });
        });
        res.write(body);
        res.end();
    });
}).listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
*/
