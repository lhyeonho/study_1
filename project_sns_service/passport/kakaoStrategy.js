const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user');

module.exports = () => {
    passport.use(new KakaoStrategy({
        clientID: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback',
    }, async (accessToken, refreshToken, profile, done) => { // accessToken, refreshToken는 실무에서 사용 (OAUTH2에서 사용되는 토큰들)
        console.log('kakao profile', profile);
    
        try {
            // 카카오 가입내역 확인
            const exUser = await User.findOne({
                where: { snsId: profile.id, provider: 'kakao' },
            });

            // 가입자 존재 시
            if (exUser) {
                done(null, exUser);

            // 가입 대상 없는 경우_회원가입 시킨 후 로그인 시킴.
            } else {
                const newUser = await User.create({
                email: profile._json && profile._json.kakao_account_email,
                nick: profile.displayName,
                snsId: profile.id,
                provider: 'kakao',
                });
                done(null, newUser);
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};