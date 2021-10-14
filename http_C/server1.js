const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Context-Type' : 'text/html; charset=utf-8' });
    res.write('<h1>Hello NodeJs World!!!</h1>');
    res.end('wow.. end');
}).listen(8080);

server.on('listening', () => {
    console.log('8080 포트 대기 중');
});

server.on('error', (error) => {
    console.error(error);
});

const server1 = http.createServer((req, res) => {
    res.writeHead(200, { 'Context-Type' : 'text/html; charset=utf-8' });
    res.write('<h1>Hello NodeJs World!!!</h1>');
    res.end('wow222.. end');
}).listen(8081);

server.on('listening', () => {
    console.log('8081 포트 대기 중');
});