const http = require('http');

const server = http.createServer((req, res) => {
    res.write('<h1>Hello NodeJs World!</h1>');
}).listen(8080);

server.on('listening', () => {
    console.log('8080 포트 대기중.');
});

server.on('error', (error) => {
    console.error(error);
});