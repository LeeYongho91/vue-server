import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import { RequestWithUser } from '@interfaces/auth.interface';
import AuthService from '@services/auth.service';
import passport from 'passport';
import { createToken } from '@utils/jwt';
import { LoginType, LOGINTYPE } from '@utils/login_type';

class AuthController {
  public authService = new AuthService();
  public cookieOptions = { maxAge: 1000 * 60 * 15 };
  public redirectUrl = `http://localhost:${process.env.CLIENT_PORT}`;

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const signUpUserData: User = await this.authService.signup(userData);

      res.status(201).json({ data: signUpUserData, message: 'signup' });
    } catch (error) {
      next(error);
    }
  };

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  public logIn = (req: Request, res: Response, next: NextFunction) => {
    try {
      // 아까 local로 등록한 인증과정 실행
      passport.authenticate('local', (passportError, user, info) => {
        // 인증이 실패했거나 유저 데이터가 없다면 에러 발생
        if (passportError || !user) {
          res.status(400).json({ message: info.reason });
          return;
        }
        // user데이터를 통해 로그인 진행
        req.login(user, { session: false }, (loginError) => {
          if (loginError) {
            res.send(loginError);
            return;
          }
          const token = createToken(user);

          res.status(200).json({ user, token, message: 'login' });
        });
      })(req, res);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.body;
      const logOutUserData: User = await this.authService.logout(userData);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  public googleLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userJson = req.user['_json'];
      const email = userJson.email;
      const nickname = userJson.name;

      const createUser: CreateUserDto = { email, nickname, password: '' };
      const loginType: LOGINTYPE = LoginType.GOOGLE;

      const user: User = await this.authService.SnsLogin(createUser, loginType);

      const token = createToken(user);

      const data = { token, user, loginType };
      // Set cookie
      res.cookie('snsData', JSON.stringify(data), this.cookieOptions); // options is optional
      res.redirect(this.redirectUrl);
    } catch (error) {
      next(error);
    }
  };

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  public kakaoLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userJson = req.user['_json'];
      const email = userJson.kakao_account.email;
      const nickname = userJson.properties.nickname;

      const createUser: CreateUserDto = { email, nickname, password: '' };
      const loginType: LOGINTYPE = LoginType.KAKAO;

      const user: User = await this.authService.SnsLogin(createUser, loginType);

      const token = createToken(user);

      const data = { token, user, loginType };
      // Set cookie
      res.cookie('snsData', JSON.stringify(data), this.cookieOptions); // options is optional
      res.redirect(this.redirectUrl);
    } catch (error) {
      next(error);
    }
  };

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  public naverLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userJson = req.user['_json'];
      const email = userJson.email;
      const nickname = userJson.nickname;

      if (!email || !nickname) res.redirect(`${this.redirectUrl}/oauth/error`);

      const createUser: CreateUserDto = { email, nickname, password: '' };
      const loginType: LOGINTYPE = LoginType.NAVER;

      const user: User = await this.authService.SnsLogin(createUser, loginType);

      const token = createToken(user);

      const data = { token, user, loginType };

      // Set cookie
      res.cookie('snsData', JSON.stringify(data), this.cookieOptions); // options is optional
      res.redirect(this.redirectUrl);
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
