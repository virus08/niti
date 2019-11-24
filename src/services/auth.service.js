import * as Msal from 'msal';

export default class AuthService {
  constructor() {
    this.applicationConfig = {
      graphScopes : {
        scopes: ["user.read"]
    }
    }
    var msalConfig = {
      auth: {
        clientId: "d8ae0c56-3d9a-4e5b-b333-b082701e853e",
        authority: "https://login.microsoftonline.com/730e7c1f-aaa1-4990-8a65-e377c3fd0eef",
        redirectURI: "http://localhost:8080/"
      },
      cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: true
      }
    };

    this.app = new Msal.UserAgentApplication(msalConfig);
  }
  login() {
    return this.app.loginPopup(this.applicationConfig.graphScopes).then(
      idToken => {
        const user = this.app.getAccount();
        if (user) {
          return user;
        } else {
          return null;
        }
      },
      () => {
        return null;
      }
    );
  };
  logout() {
    this.app.logout();
  };
  getToken() {
    return this.app.acquireTokenSilent(this.applicationConfig.graphScopes).then(
      Token => {
        return Token.accessToken;
      },
      error => {
        return this.app
          .acquireTokenPopup(this.applicationConfig.graphScopes)
          .then(
            accessToken => {
              return accessToken;
            },
            err => {
              //console.error(err);
            }
          );
      }
    );
  };
}