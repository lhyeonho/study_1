const passport = require('passport');
const localStrategy = require('passport-local');
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = () => {
    passport.use(new localStrategy({
        usernameField: 'email',     // req.body.email
        passwordField: 'password',  // req.body.password
    }, async (email, password, done) => {
        try {
            // 로그인 시 입력된 이메일을 가진 대상이 존재하는지 확인.
            const exUser = await User.findOne({ where : { email } });

            // 입력된 이메일 대상이 존재하는 경우.
            if (exUser) {

                // 비밀번호 비교(입력된 비밀번호와 해시화된 비밀번호 비교)
                const result = await bcrypt.compare(password, exUser.password);
                if (result) {
                    done(null, exUser); // done의 경우 인수를 3개 받음. 여기서 1번 : 서버 / 2번 : 로그인가능여부 / 3번 로그인실패시 메시지
                } else {
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
                }
            // 입력된 이메일 대상이 존재하지 않는 경우.
            } else {
                done(null, false, { message: '가입되지 않은 회원입니다.' });
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};