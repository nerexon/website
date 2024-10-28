const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;
const publicDir = path.join(__dirname, 'public');

// MIME types mapping
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm',
    '.txt': 'text/plain'
};

const server = http.createServer((req, res) => {
    const ip = req.socket.remoteAddress;
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`; // Format HH:mm:ss
    let filePath = path.join(publicDir, req.url === '/' ? 'index.html' : req.url);

    console.log(`[${time}] [${ip}] - ${req.url}`);

    fs.stat(filePath, (err, stats) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return send404(res);
            }
            return send500(res, err);
        }

        if (stats.isDirectory()) {
            filePath = path.join(filePath, 'index.html');
            // Serve directory listing if index.html doesn't exist
            if (!fs.existsSync(filePath)) {
                return sendDirectoryListing(res, filePath);
            }
        }

        const extname = path.extname(filePath).toLowerCase();
        const contentType = mimeTypes[extname] || 'text/plain';

        // Set caching headers for static files
        res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day
        const stream = fs.createReadStream(filePath);

        stream.on('open', () => {
            res.writeHead(200, { 'Content-Type': contentType });
            stream.pipe(res);
        });

        stream.on('error', (error) => {
            send500(res, error);
        });
    });
});

function send404(res) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 Not Found</h1>', 'utf-8');
}

function send500(res, error) {
    console.error(`Server Error: ${error.message}`);
    res.writeHead(500, { 'Content-Type': 'text/html' });
    res.end('<h1>500 Server Error</h1>', 'utf-8');
}

function sendDirectoryListing(res, dirPath) {
    fs.readdir(dirPath, (err, files) => {
        if (err) {
            return send500(res, err);
        }
        const fileList = files.map(file => `<li><a href="${file}">${file}</a></li>`).join('');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`<h1>Directory Listing</h1><ul>${fileList}</ul>`, 'utf-8');
    });
}

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down server...');
    server.close(() => {
        console.log('Server shut down gracefully.');
        process.exit(0);
    });
});

// Start the server
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
