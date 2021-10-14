const http = require('http');

http.createServer((req, res) => {
    console.log(req.url, req.headers.cookie);

    // writeHead : 요청 헤더에 입력하는 메서드
    // Set-Cookie : 브라우저에게 쿠키를 설정하라고 명령.
    res.writeHead(200, { 'Set-Cookie' : 'mycookie=test' });     
    res.end('Hello Cookie');
}).listen(8083, () => {
    console.log('8083 포트 대기 중');
});