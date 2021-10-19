const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

// 회원가입_ 로그인 안 한 사람만 회원가입 할 수 있도록 isNotLoggedIn
router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { email, nick, password } = req.body;

    try {
        // 먼저 기존에 입력된 이메일로 가입된 대상 있는지 검사.
        const exUser = await User.findOne({ where : { email } });   

        // 입력된 이메일로 가입된 대상이 존재하는 경우.
        if (exUser) {
            return res.redirect('/join?error=exist');   // 쿼리스트링사용 프론트로 exist 날려서 프론트에서 처리될 수 있도록 함.
        }

        // 입력된 이메일로 가입된 대상 없는경우.
        const hash = await bcrypt.hash(password, 12);   // hash(값, 12)에서 12는 얼마나 복잡하게 해시할건지 나타냄. (높을수록 복잡함, 소요시간 오래걸림)

        // 유저 생성.
        await User.create({
            email,
            nick,
            password: hash,
        });

        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

// 로그인 로그인 안 한 사람만 로그인 할 수 있도록 isNotLoggedIn
router.post('/login', isNotLoggedIn, (req, res, next) => {
    // 미들웨어를 확장하는 패턴.
    // login 시 아이디 비밀번호 입력하면 passport.authenticate('local', 부분 실행 -> localStrategy.js 로 가게됨.
    passport.authenticate('local', (authError, user, info) => {
        
        // 서버에 에러있는 경우.
        if (authError) {
            console.error(authError);
            return next(authError);
        }

        // 로그인 실패한 경우
        if (!user) {
            return res.redirect(`/?loginError=${info.message}`);    // 로그인 실패에 관한 메시지를 담아서 프론트로 전달.
        }

        // 로그인 성공한 경우 이때 passport의 index.js로 가게됨.
        return req.logIn(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }

            return res.redirect('/');
        });
    })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙임.
});

// 로그아웃 로그인 한 사람만 로그아웃 할 수 있도록 isLoggedIn
router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

// kakao로 로그인 하기 클릭 authenticate('kakao') -> kakaoStrategy로 가게됨 그래서 카카오 로그인을 하게됨. (kakao 사이트로 가게됨)
router.get('/kakao', passport.authenticate('kakao'));

// kakao 로그인 성공 시 kakao에서 /kakao/callback로 요청을 쏴줌. -> passport.authenticate('kakao', 실행 -> kakaoStrategy로로 가서 검사진행.
router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/',   // 실패 시 여기로.
}), (req, res) => {         // 성공 시 여기 실행.
    res.redirect('/');
});

module.exports = router;