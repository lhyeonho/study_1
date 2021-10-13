const http = require('http');
const fs = require('fs').promises;

const server = http.createServer(async (req, res) => {
    try {
        res.writeHead(200, { 'Context-Type' : 'text/html; charset=utf-8' });
        const data = await fs.readFile('./server2.html');
        res.end(data);
    } catch {
        console.error(err);
        res.writeHead(200, { 'Context-Type' : 'text/html; charset=utf-8' });
        res.end(err.message);
    }
    
})
    .listen(8080);
server.on('listenig', () => {
    console.log('8080번 포트에서 서버 대기 중.');
});
server.on('error', (error) => {
    console.log(error);
});
