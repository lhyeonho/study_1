const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');

// dotenv.config() 의 경우 require 한 후 최대한 위에 적어주는게 좋음.
// dotenv.config() 입력된 이후 값들이 설정파일에 들어가짐.
dotenv.config();
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');

// sequelize
const { sequelize } = require('./models');

// passport
const passportConfig = require('./passport');

const app = express();

// 개발, 배포 시 포트 다르게 사용하기 위함. (배포시에는 .env에 PORT 번호 별도로 넣어줄 것.)
app.set('port', process.env.PORT || 8001);

// 넌적스(nunjucks) 설정 방법.
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});

// sequelize. 
// force : true의 경우 테이블이 지워졌다가 다시 생성됨.(문제점 : 데이터도 날아감)
// alter : true의 경우 데이터는 유지, 테이블 컬럼 바뀐것 반영 시 사용(문제점 : 컬럼과 기존데이터가 맞지않아 에러발생될 수 있음.) 
// 기본적으로 force : false로 했다가 추후 모델 변경 되는일 발생 시 true로 변경. (하지만, 실무에서는 기존 데이터 날아가므로 alter true하거나 워크벤치에서 직접 수정.)
sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  }).catch((err) => {
    console.error(err);
  });

passportConfig();  

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

// 익스프레스 세션보다 아래 위치해야 함. (익스프레스 세션에 세션을 저장했기때문. 해당 세션을 받아서 처리하기 위함.)
app.use(passport.initialize());
app.use(passport.session());  // passport.session 실행 시 passport index.js의 deserializeUser이 실행됨. 

app.use('/', pageRouter);
app.use('/auth', authRouter);

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