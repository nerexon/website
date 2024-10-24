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
    const ip = req.socket.remoteAddress; // Get the client's IP address
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`; // Format HH:mm:ss
    let filePath = path.join(publicDir, req.url === '/' ? 'index.html' : req.url);
    
    // Log the request with time and IP
    console.log(`[${time}] [${ip}] - ${req.url}`);

    // If the request is for a directory, serve index.html from that directory
    fs.stat(filePath, (err, stats) => {
        if (!err && stats.isDirectory()) {
            filePath = path.join(filePath, 'index.html');
        }

        // Get the file extension
        const extname = path.extname(filePath).toLowerCase();
        const contentType = mimeTypes[extname] || 'text/plain';

        // Stream the file instead of reading it into memory
        const stream = fs.createReadStream(filePath);
        stream.on('open', () => {
            res.writeHead(200, { 'Content-Type': contentType });
            stream.pipe(res);
        });

        stream.on('error', (error) => {
            if (error.code === 'ENOENT') {
                // File not found
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                // Some server error
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`);
                console.error(`Error serving file: ${error.message}`);
            }
        });
    });
});

// Start the server
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
