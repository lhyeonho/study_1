const mongoose = require('mongoose');

const connect = () => {
  if (process.env.NODE_ENV !== 'production') {
    mongoose.set('debug', true);    // 개발 시 debug 모드 true.(쿼리가 콘솔에 보이도록 해줌)
  }

  // mongodb://설정한 관리자아이디:비밀번호@localhost:27017/admin
  mongoose.connect('mongodb://root:dlagusgh1@localhost:27017/admin', { // 로그인을 위한 db
    dbName: 'nodejs',   // 실제로 데이터 저장할 db명
    useNewUrlParser: true,
    useCreateIndex: true,
  }, (error) => {
    if (error) {
      console.log('몽고디비 연결 에러', error);
    } else {
      console.log('몽고디비 연결 성공');
    }
  });
};

// 에러 기록하는 이벤트 리스너.
mongoose.connection.on('error', (error) => {
  console.error('몽고디비 연결 에러', error);
});

// 연결 끊겼을 때 연결 재시도 코드.
mongoose.connection.on('disconnected', () => {
  console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.');
  connect();
});

module.exports = connect;