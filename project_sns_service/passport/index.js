const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

// passport는 전략을 사용(로그인을 어떻게 할지 적어놓은 파일.)
module.exports = () => {

    // 메모리의 효율성을 위해 serializeUser, deserializeUser 사용
    // auth.js 에서 login 라우터 에서 req login에 넣은 유저가 넘어와서
    passport.serializeUser((user, done) => {
        done(null, user.id);    // 유저에서 user의 id만 뽑아서 done 수행. -> 세션의 유저 id만 저장하는 것. (user 저장가능하지만, 서버 메모리가 한정적이므로 id만 저장./ 실무에서는 메모리에도 저장하면 안됨_실무에서 이러면 컴퓨터가 못버팀)
    });

    // 메모리에 저장된 id로 user.findOne 해서 전체 유저를 복구해줌.
    passport.deserializeUser((id, done) => {
        User.findOne({ where: { id } })
            .then(user => done(null, user)) // req.user로 접근할 수 있게됨.(로그인한 사용자 정보 확인가능)
            .catch(err => done(err));
    });

    local();
    kakao();
};