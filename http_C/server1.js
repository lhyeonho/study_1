const http = require('http');

const server = http.createServer((req, res) => {
    // 요청에 대한 응답 작성. (응답 거부 가능.)
    res.writeHead(200, { 'Content-Type' : 'text/html; charset=utf-8'});
    res.write('<h1>Hello Node!</h1>');
    res.write('<p>Hello server</p>');
    res.end('<p>Hello Zero</p>');
})
    .listen(8080);
server.on('listening', () => {
    console.log('8080번 포트에서 서버 대기 중입니다.');
});

server.on('error', (error) => {
    console.error(error);
});


const server1 = http.createServer((req, res) => {
    // 요청에 대한 응답 작성. (응답 거부 가능.)
    res.writeHead(200, { 'Content-Type' : 'text/html; charset=utf-8'});
    res.write('<h1>Hello Node!</h1>');
    res.write('<p>Hello server</p>');
    res.end('<p>Hello Zero</p>');
})
    .listen(8081);
