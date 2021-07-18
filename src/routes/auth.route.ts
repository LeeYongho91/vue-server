import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import { LoginUserDto, CreateUserDto } from '@dtos/users.dto';
import Route from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';
import passport from 'passport';

class AuthRoute implements Route {
  public path = '/';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}signup`, validationMiddleware(CreateUserDto, 'body'), this.authController.signUp);

    // 일반 로그인
    this.router.post(`${this.path}login`, validationMiddleware(LoginUserDto, 'body'), this.authController.logIn);

    // 구글 로그인
    this.router.get(`${this.path}auth/google`, passport.authenticate('google', { scope: ['email', 'profile'] }));
    this.router.get(`${this.path}auth/google/callback`, passport.authenticate('google', { failureRedirect: '/login' }), this.authController.googleLogin);

    //카카오 로그인
    this.router.get(`${this.path}auth/kakao`, passport.authenticate('kakao'));
    this.router.get(`${this.path}auth/kakao/callback`, passport.authenticate('kakao', { failureRedirect: '/login' }), this.authController.kakaoLogin);

     //네이버 로그인
     this.router.get(`${this.path}auth/naver`, passport.authenticate('naver'));
     this.router.get(`${this.path}auth/naver/callback`, passport.authenticate('naver', { failureRedirect: '/login' }), this.authController.naverLogin);
  }
}

export default AuthRoute;
