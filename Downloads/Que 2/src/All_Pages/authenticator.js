import React from "react";
import {
  Stitch, AnonymousCredential,
  RemoteMongoClient,
  UserPasswordCredential,
  UserPasswordAuthProviderClient,
} from "mongodb-stitch-react-native-sdk";

const appId = "que-eblub";

var mongodb = {};
var db = {};

export default class Authenticator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUserId: undefined,
      client: undefined,
    };
    this.loadClient = this.loadClient.bind(this);
    this.login = this.login.bind(this);
    this.onPressLogout = this.onPressLogout.bind(this);
  }

  componentDidMount() {
    console.log('authenticator mounted');
    console.log(this.props);
    this.loadClient();
  }



  async loadClient() {
    console.log('in load lcient');
    Stitch.initializeDefaultAppClient(appId).then((client) => {
      this.setState({ client });
      console.log('client loaded');
      console.log('load Client:- ',client);
      if (client.auth.isLoggedIn) {
        this.setState({ currentUserId: client.auth.user.id });
      }
    });
  }

 async login() {
    console.log("in login");
    console.log(phone);
    console.log(this.props);
    //handles both login and signup}

  if (typeof this.state.client !== "undefined") {
    this.state.client.auth.loginWithCredential(new AnonymousCredential())
    .then((user) => {
        console.log(
          `Successfully logged in as user ${user.id}`
        );
        this.setState({ currentUserId: user.id });
      })
      .catch((err) => {
        console.log(`Failed to log in anonymously: ${err}`);
        this.setState({ currentUserId: undefined });
      });
  } else {
    await this.loadClient();
      this.state.client.auth
        .loginWithCredential(new AnonymousCredential())
        .then((user) => {
          console.log(
            `Successfully logged in as user ${user.id}`
          );
          this.setState({ currentUserId: user.id });
        })
        .catch((err) => {
          console.log(
            `Failed to log in anonymously: ${err}`
        );
        this.setState({ currentUserId: undefined });
    });
  }
}

  onPressLogout() {
    this.state.client.auth
      .logout()
      .then((user) => {
        console.log(`Successfully logged out`);
        this.setState({ currentUserId: undefined });
      })
      .catch((err) => {
        console.log(`Failed to log out: ${err}`);
        this.setState({ currentUserId: undefined });
      });
  }
}
