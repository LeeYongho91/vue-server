export const LoginType = {
  NORMAL: 'normal',
  GOOGLE: 'google',
  NAVER: 'naver',
  KAKAO: 'kakao',
} as const;

export type LOGINTYPE = typeof LoginType[keyof typeof LoginType];
