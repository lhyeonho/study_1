const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');

// dotenv.config() 의 경우 require 한 후 최대한 위에 적어주는게 좋음.
// dotenv.config() 입력된 이후 값들이 설정파일에 들어가짐.
dotenv.config();
const pageRouter = require('./routes/page');

const app = express();

// 개발, 배포 시 포트 다르게 사용하기 위함. (배포시에는 .env에 PORT 번호 별도로 넣어줄 것.)
app.set('port', process.env.PORT || 8001);

// 넌적스(nunjucks) 설정 방법.
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));

app.use('/', pageRouter);

// 위 라우터에서 요청을 처리할 수 없으면 여기로 이동.
app.use((req, res, next) => {
  const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);  // 에러 미들웨어로 넘김
});

// 에러 미들웨어.
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500).render('error');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});