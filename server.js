const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const posts = [];
let nextId = 1;

function serveStatic(filePath, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath);
    const contentType = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json'
    }[ext] || 'text/plain';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  if (parsedUrl.pathname === '/api/posts') {
    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(posts));
    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const { author, content } = JSON.parse(body);
          const post = { id: nextId++, author, content, time: new Date().toISOString() };
          posts.push(post);
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(post));
        } catch {
          res.statusCode = 400;
          res.end('Invalid JSON');
        }
      });
    } else {
      res.statusCode = 405;
      res.end('Method not allowed');
    }
  } else {
    let filePath = 'public' + (parsedUrl.pathname === '/' ? '/index.html' : parsedUrl.pathname);
    serveStatic(path.join(__dirname, filePath), res);
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = server;
