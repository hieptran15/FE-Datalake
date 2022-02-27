export class Login {
  constructor(public username: string, public password: string, public tokenDevice: string, public deviceName: string, public rememberMe: boolean, public sso: boolean, public ticket: string) {
  }
}
