const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();

app.set('port', process.env.PORT || 3000);

// 개발 시 사용.
app.use(morgan('dev'));

// 실무에서 사용
// app.use(morgan('combined'));

app.use(cookieParser(abcdefg));
app.use(express.json());
app.use(express.urlencoded({ extended : true }));

app.get('/', (req, res) => {
    req.cookies // { mycookie: 'test' 등으로 }알아서 파싱됨 
    req.signedCookies   // 서명된 쿠키.
    //'Set-Cookie' : `name=${encodeURIComponent(name)}; Expires=${expires.toGMYString()}; HttpOnly; Path=/`,
    res.cookie('name', encodeURIComponent(name), {
        expires: new Date(),
        httpOnly: true,
        path: '/',
    })
    // 쿠키 삭제 시.
    res.clearCookie('name', encodeURIComponent(name), {
        httpOnly: true,
        path: '/',
    })
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

app.get((req, res, next) => {
    res.status(200).send('200이지렁!!');
});

app.get((req, res, next) => {
    res.status(404).send('404이지렁!!');
});

app.get('*', (req, res) => {
    res.send('와일드카드 * 는 모든 GET은 여길 실행하겠다는 것.');
});

app.listen(app.get('port'), () => {
    console.log('익스프레스 서버 실행');
});