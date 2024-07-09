export enum VerifyUserStatus {
  Unverified, //chua verify mac dinh = 0
  Verified, //da verify
  Banned //tai khoan bi ban
}

export enum TokenType {
  AccessToken,
  RefreshToken,
  ForgotPasswordToken,
  EmailVerifyToken
}

export enum MediaType {
  Image,
  Video
}
