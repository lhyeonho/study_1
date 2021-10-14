const express = require('express');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const app = express();
const cookieParser = require('cookie-parser');

app.set('port', process.env.PORT || 3000);

/* 미들웨어 안에 미들웨어 넣는 방법_1
app.use(morgan('dev'));
*/ 
/* 미들웨어 안에 미들웨어 넣는 방법_2
app.use((req, res, next) => {
    morgan('dev')(req, res, next);
});
*/
/* 미들웨어 안에 미들웨어 넣는 방법_3 
app.use((req, res, next) => {
	if (process.env.NODE_ENV === 'production') {
    	morgan('combined')(req, res, next);
    } else {
    	morgan('dev')(req, res, next);
    }
});
*/

/* 아래 코드를 예로 미들웨어 확장법 이용, 로그인 한 대상에게만 express.static 실행되도록 하는 예
app.use('/', express.static(path.join(__dirname, 'public'))); 를 예로..

app.use('/', (req, res, next) => {
	if (req.session.id) {	// 로그인 시.
    	express.static(path.join(__dirname, 'public')))(req, res, next);
    } else {
		next();
	}
});
*/

app.use(morgan('dev'));         // 서버로 들어온 요청과 응답을 기록해주는 미들웨어. dev의 경우 개발 시 사용.
// app.use(morgan('combined'));    // 배포 시? 사용.


app.use(cookieParser());    // 요청 헤더의 쿠키를 해석해주는 미들웨어.
// app.use(cookieParser(비밀키))    // 비밀키롤 서명을 붙여 내 서버가 만든 쿠키임을 검증할 수 있다.

/* 실제 쿠키 옵션을 넣을 수 있음.
res.cookie('name', 'zerocho', {
	expires : new Date(Date.now() + 900000),
    httpOnly : true,
    secure : true,
});
*/
/* 지울때는 ClearCookie 사용. (이때 expires와 maxAge를 제외한 옵션들이 일치해야 함)
res.ClearCookie('name', 'zerocho', { httpOnly : true, secure : true });
*/



/* body-parser : 요청의 본문을 해석해주는 미들웨어.
app.use(express.json());    // json 미들웨어 : 본문이 json인 경우 해석
app.use(express.urlencoded({ extended : false }));  // urlencoded 미들웨어 : 폼 요청 해석 (true : qs / flase : 쿼리스트링 모듈 사용)
*/
/* 버퍼 데이터 or text 데이터 일때는 npm i body-parser로 직접 설치 필요.
const bodyParser = require('body-parser');
app.use(bodyParser.raw());
app.use(bodyParser.text());
*/

/* static 미들웨어 : 정적 파일들을 제공하는 미들웨어
// app.use('요청 경로', express.static('실제 경로'));
app.use('/', express.static(path.join(__dirname, 'public')));
*/

/* express-session
// app.use(session());
app.use(session({
    resave: false,  // 요청 왔을 때 세션에 수정사항이 생기지 않아도 다시 저장할지 여부.
    saveUninitialized: false,   // 세션에 저장할 내역 없어도 세션 저장할지 여부.
    secret: 'abcabc',   // 쿠키 암호화
    cookie: {   // 세션 쿠키 옵션
        httpOnly: true, // 자바스크립트 공격을 막기위해 항상 설정.
        secure: false,
    },
    name: 'connect.sid',    // name의 기본 값 : connect.sid(변경가능), 서명되어있어서 읽을수 없는 문자열로 바뀜.
}));

app.get('/', (req, res, next) => {
    req.session.id = 'hello';   // 이렇게 할 경우 요청을 보낸 사람의 id만 hello가 됨.
});
*/

/* multer 멀티파트 데이터 형식.
// upload.single : 하나의 파일을 업로드 할 때.
app.post('/upload', upload.single('image'), (req, res) => {
    console.log(req.file, req.body);
    res.send('ok');
});

// upload.none : 파일은 업로드 하지 않을 때.
app.post('/upload', upload.none(), (req, res) => {
    console.log(req.body);
    res.send('ok');
});

// upload.array : 여러 개의 파일을 업로드 할 때.
app.post('/upload', upload.array('many'), (req, res) => {
    console.log(req.files, req.body);
    res.send('ok');
});
*/

app.use((req, res, next) => {
    console.log('모든 요청에 실행하고 싶음.');
    next();
    // next('route');  // 이렇게 하면 다음 라우터로 넘어감.
    /*  이런식으로 분기처리에 따라 다른게 실행되도록 하는것도 가능.
    if (true) {
        next('route');
    } else {
        next();
    }
    */
}, (req, res, next) => {
    try {
        console.log('abcdefg');
    } catch (error) {
        next(error);
    }
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(200).send('에러 발생함.');
});

/* 미들웨어간 데이터 전달 예_1
app.use((req, res, next) => {
    read.data = '데이터 넣기';
    next();
}, (req, res, next) {
    console.log(req.data);  // 데이터 받기.
    next();
});
*/

/* 미들웨어간 데이터 전달 예_2
app.use((req, res, next) => {
    req.session.data = 'zerocho 암호';
});

app.get('/', (req, res) => {
    req.session.data;   // zerocho 암호 들어있음. 이 경우에는 다음 요청때도 데이터가 남아있게 됨.
    res.sendFile(path.join(__dirname, 'index.html'));
});
*/

/* 미들웨어간 데이터 전달 예_3
app.use((req, res, next) => {
    req.data = 'zerocho 암호';
});

app.get('/', (req, res, next) => {
    req.data;   // zerocho 암호 들어있음. 요청 한 번만 할 경우 사용.
});
*/

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/', (req, res) => {
    res.send('Hello express');
});

app.get('/category/Javascript', (req, res) => {
    res.send('Hello Javascript');
});

app.get('/category/:name', (req, res) => {
    res.send(`Hello ${req.params.name}`);
});

app.get('/about', (req, res) => {
    res.send('hello express');
});

app.get('*', (req, res) => {
    res.send('* 는 모든 GET은 여길 실행하겠다는 것.');
});

app.get((req, res, next) => {
    res.status(200).send('200번대 에러');
});

app.get((req, res, next) => {
    res.status(404).send('400번대 에러');
});

app.get((req, res, next) => {
    res.status(401).send('400번대 에러');
});

app.use((err, req, res, next) => {
    console.error(err);
});

app.listen(app.get('port'), () => {
    console.log('express 서버 실행');
});
