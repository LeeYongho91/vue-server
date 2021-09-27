import passport from 'passport';
import passportLocal from 'passport-local';
import passportJwt from 'passport-jwt';
import GoogleOauth from 'passport-google-oauth20';
import bcrypt from 'bcrypt';
import DB from '@databases/index';
import { User } from '@/interfaces/user/users.interface';
import config from 'config';
const GoogleStrategy = GoogleOauth.Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const NaverStrategy = require('passport-naver').Strategy;

class Passport {
  public User = DB.Users;
  public LocalStrategy = passportLocal.Strategy;
  public ExtractJwt = passportJwt.ExtractJwt;
  public JWTStrategy = passportJwt.Strategy;
  public secretKey: string = config.get('secretKey');
  public callbackUrl = `http://localhost:${process.env.PORT}/auth/`;

  public passportConfig = () => {
    const passportConfig = { usernameField: 'email', passwordField: 'password' };

    const passportVerify = async (email, password, done) => {
      try {
        const user: User = await this.User.findOne({ where: { email: email } });
        if (!user) {
          done(null, false, { reason: '존재하지 않는 사용자 입니다.' });
          return;
        }
        const compareResult = await bcrypt.compare(password, user.password);

        if (compareResult) {
          done(null, user);
          return;
        }
        done(null, false, { reason: '올바르지 않은 비밀번호 입니다.' });
      } catch (error) {
        console.error(error);
        done(error);
      }
    };

    const JWTConfig = {
      jwtFromRequest: this.ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: this.secretKey,
    };

    const JWTVerify = async (jwtPayload, done) => {
      try {
        console.log('test');
        console.log(jwtPayload);
        // payload의 id값으로 유저의 데이터 조회
        const user = await this.User.findOne({ where: { seq: jwtPayload.seq } });
        // 유저 데이터가 있다면 유저 데이터 객체 전송
        if (user) {
          done(null, user);
          return;
        }
        // 유저 데이터가 없을 경우 에러 표시
        done(null, false, { reason: '올바르지 않은 인증정보 입니다.' });
      } catch (error) {
        console.error(error);
        done(error);
      }
    };

    passport.serializeUser((user, done) => {
      //console.log('passport session save: ', user['id']);
      done(null, user);
    });

    passport.deserializeUser((user, done) => {
      // console.log('passport session get id: ', user['id']);
      done(null, user);
    });

    // 구글 인증
    passport.use(
      new GoogleStrategy(
        {
          clientID: '897216138971-mb8bfh5eln29pbanm8kl6kvo544tndkc.apps.googleusercontent.com',
          clientSecret: 'qnCYEIfxfvxzyRP76_1GDcc5',
          callbackURL: this.callbackUrl + 'google/callback',
        },
        function (accessToken, refreshToken, profile, done) {
          return done(null, profile);
        }
      )
    );

    // 카카오 인증
    passport.use(
      new KakaoStrategy(
        {
          clientID: 'b47ae472c4d7398134d2456904b96619',
          clientSecret: 'gPqEXOAeYtSa6F9ThNYiyVlKtwaErNQ1',
          callbackURL: this.callbackUrl + 'kakao/callback',
        },
        function (accessToken, refreshToken, profile, done) {
          return done(null, profile);
        }
      )
    );

    // 네이버 인증
    passport.use(
      new NaverStrategy(
        {
          clientID: 'levL_eG6gNo8OdTcODV5',
          clientSecret: 'S5sq1cA8Rf',
          callbackURL: this.callbackUrl + 'naver/callback',
        },
        function (accessToken, refreshToken, profile, done) {
          return done(null, profile);
        }
      )
    );

    passport.use('local', new this.LocalStrategy(passportConfig, passportVerify));
    passport.use('jwt', new this.JWTStrategy(JWTConfig, JWTVerify));
  };
}

export default Passport;
