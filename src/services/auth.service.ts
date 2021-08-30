import bcrypt from 'bcrypt';
import DB from '@databases/index';
import { CreateUserDto, EmailDoubleCheckDto, nicknameDoubleCheckDto, accountUpdateDto, userWithdrawDto } from '@dtos/auth.dto';
import HttpException from '@exceptions/HttpException';
import { User } from '@/interfaces/user/users.interface';
import { isEmpty } from '@utils/util';
import { uuid1 } from '@utils/uuid';
import { LoginType, LOGINTYPE } from '@utils/login_type';
import { createToken, createCookie } from '@utils/jwt';

class AuthService {
  public users = DB.Users;

  /**
   *
   * @param userData
   * @returns
   */
  public async signup(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `You're email ${userData.email} already exists`);

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const uuid: string = uuid1();
    const login_type: LOGINTYPE = LoginType.NORMAL;

    const createUserData: User = await this.users.create({ ...userData, uuid, password: hashedPassword, login_type });

    return createUserData;
  }

  /**
   *
   * @param userData
   * @returns
   */
  public async login(userData: CreateUserDto): Promise<{ cookie: string; findUser: User }> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findOne({ where: { email: userData.email } });
    if (!findUser) throw new HttpException(409, `You're email ${userData.email} not found`);

    const isPasswordMatching: boolean = await bcrypt.compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, "You're password not matching");

    const tokenData = createToken(findUser);
    const cookie = createCookie(tokenData);

    return { cookie, findUser };
  }

  /**
   *
   * @param userData
   * @returns
   */
  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findOne({ where: { email: userData.email } });
    if (!findUser) throw new HttpException(409, "You're not user");

    return findUser;
  }

  /**
   *
   * @param userData
   * @param loginType
   * @returns
   */
  public async SnsLogin(userData: CreateUserDto, loginType: LOGINTYPE): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findOne({ where: { login_type: loginType, email: userData.email } });
    if (!findUser) {
      const uuid: string = uuid1();
      const createUserData: User = await this.users.create({ ...userData, uuid, password: '', login_type: loginType });
      return createUserData;
    } else {
      return findUser;
    }
  }

  /**
   *
   * @param email
   * @returns
   */
  public async emailDoubleCheck(email: EmailDoubleCheckDto): Promise<boolean> {
    if (isEmpty(email)) throw new HttpException(400, 'email is empty');
    const login_type: LOGINTYPE = LoginType.NORMAL;

    const emailCount = await this.users.count({ where: { email: email, login_type: login_type } });

    if (emailCount == 0) {
      return true;
    }

    return false;
  }

  /**
   *
   * @param nickname
   * @returns
   */
  public async nicknameDoubleCheck(nickname: nicknameDoubleCheckDto): Promise<boolean> {
    if (isEmpty(nickname)) throw new HttpException(400, 'nickname is empty');
    const login_type: LOGINTYPE = LoginType.NORMAL;

    const nicknameCount = await this.users.count({ where: { nickname: nickname, login_type: login_type } });

    if (nicknameCount == 0) {
      return true;
    }

    return false;
  }

  /**
   *
   * @param userData
   * @returns
   */
  public async accountUpdate(userData: accountUpdateDto): Promise<boolean> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const result = await this.users.update({ ...userData, password: hashedPassword }, { where: { uuid: userData.uuid } });

    if (result[0] == 1) {
      return true;
    }

    return false;
  }

  /**
   *
   * @param uuid
   * @returns
   */
  public async userWithdraw(uuid: userWithdrawDto): Promise<boolean> {
    if (isEmpty(uuid)) throw new HttpException(400, 'uuid is empty');

    const result = await this.users.destroy({ where: { ...uuid } });

    if (result == 1) {
      return true;
    }

    return false;
  }
}

export default AuthService;
