const express = require('express');
const path = require('path');
const app = express();

app.set('port', process.env.PORT || 3000);

app.use((req, res, next) => {
    console.log('모든 요청에 실행하고 싶어.');
    next();
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/', (req, res) => {
    res.send('hello express');
});

app.get('/category/Javascript', (req, res) => {
    res.send('hello Javascript');
});

app.get('/category/:name', (req, res) => {
    res.send(`hello ${req.params.name}`);
});

app.get('/about', (req, res) => {
    res.send('hello express');
});

app.get('*', (req, res) => {
    res.send('와일드카드 * 는 모든 GET은 여길 실행하겠다는 것.');
});

app.listen(app.get('port'), () => {
    console.log('익스프레스 서버 실행');
});