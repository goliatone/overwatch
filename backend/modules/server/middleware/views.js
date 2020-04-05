'use strict';
const ejs = require('ejs');
// const flru = require('flru');
const { join } = require('path');
const fs = require('fs');

module.exports.init = function(server, config) {

    /**
     * TODO: Get from config
     * TODO: Enable multiple source directories?
     */
    const views = join(__dirname, '../views');

    // ejs.cache = flru(100); // LRU cache with 100-item limit

    /**
     * Add our renderer _engine_ :)
     */
    server.use((req, res, next) => {
        res.render = (str, data) => {
            res.setHeader('content-type', 'text/html');
            res.end(ejs.render(str, data));
        };

        res.renderFile = (file, data) => {
            let tmpl;
            try {
                if (file.indexOf('.ejs') === -1) {
                    file = `${file}.ejs`;
                }
                tmpl = fs.readFileSync(join(views, file));

                return res.render(tmpl.toString(), data);
            } catch (error) {
                console.error('Error rendering page');
                console.error(error);
                res.writeHead(500, { 'content-type': 'text/html' });
                return res.end(`
                  <!DOCTYPE html>
                  <body>
                    <h2>Internal Server Error</h2>
                    <code>${JSON.stringify(error)}</code>
                  </body>
                `);
            }
        };
        next();
    });
};