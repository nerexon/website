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

// Simple in-memory rate limiter
const rateLimit = {};
const MAX_REQUESTS_PER_MINUTE = 60;

// Check if rate limiting is enabled via environment variable
const isRateLimitEnabled = process.env.RATE_LIMIT_ENABLED !== 'false';

const server = http.createServer(handleRequest);

// Function to handle requests
function handleRequest(req, res) {
    const ip = req.socket.remoteAddress; // Can be null if using Cloudflare
    const now = new Date();
    const time = formatTime(now);

    // Rate limiting
    if (isRateLimitEnabled && ip) {
        if (!rateLimit[ip]) {
            rateLimit[ip] = { count: 0, lastRequest: now };
        }
        
        const { count, lastRequest } = rateLimit[ip];
        const timeDifference = (now - lastRequest) / 1000; // seconds

        if (timeDifference > 60) {
            rateLimit[ip] = { count: 1, lastRequest: now }; // Reset count
        } else {
            if (count >= MAX_REQUESTS_PER_MINUTE) {
                return send429(res); // Too many requests
            }
            rateLimit[ip].count += 1;
        }
    }

    logRequest(ip, time, req.url);
    
    let filePath = path.join(publicDir, req.url === '/' ? 'index.html' : req.url);
    
    fs.stat(filePath, (err, stats) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return send404(res);
            }
            return send500(res, err);
        }

        if (stats.isDirectory()) {
            filePath = path.join(filePath, 'index.html');
            if (!fs.existsSync(filePath)) {
                return sendDirectoryListing(res, filePath);
            }
        }

        const extname = path.extname(filePath).toLowerCase();
        const contentType = mimeTypes[extname] || 'text/plain';

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
}

function logRequest(ip, time, url) {
    console.log(`[${time}] [${ip}] - ${url}`);
}

function send404(res) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 Not Found</h1>', 'utf-8');
}

function send500(res, error) {
    console.error(`Server Error: ${error.message}`);
    res.writeHead(500, { 'Content-Type': 'text/html' });
    res.end('<h1>500 Server Error</h1>', 'utf-8');
}

function send429(res) {
    res.writeHead(429, { 'Content-Type': 'text/html' });
    res.end('<h1>429 Too Many Requests</h1>', 'utf-8');
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

function formatTime(date) {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`; // Format HH:mm:ss
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
