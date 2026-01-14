export namespace SecurityType {
  export interface ProfileEmailDto {
    key: string;
    code: string;
    oldEmail: string;
    email: string;
  }
  export interface ProfilePhoneDto {
    key: string;
    code: string;
    oldPhone: string;
    phone: string;
  }
  export interface ProfileUserDto {
    id: string;
    sex: string;
    avatar: string | undefined;
    name: string;
    positionId: string;
  }

  export interface ProfilePasswordDto {
    oldPassword: string;
    password: string;
    confirmPassword: string;
  }
}
