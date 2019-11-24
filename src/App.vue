<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app>
      <v-list dense>
        <template v-for="item in items">
          <v-row v-if="item.heading" :key="item.heading" align="center">
            <v-col cols="6">
              <v-subheader v-if="item.heading">{{ item.heading }}</v-subheader>
            </v-col>
            <v-col cols="6" class="text-center">
              <a href="#!" class="body-2 black--text">EDIT</a>
            </v-col>
          </v-row>
          <v-list-group
            v-else-if="item.children"
            :key="item.text"
            v-model="item.model"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
            append-icon
          >
            <template v-slot:activator>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title @click="menuclick(item.text)">{{ item.text }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <v-list-item v-for="(child, i) in item.children" :key="i" link>
              <v-list-item-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title @click="menuclick(item.text)">{{ child.text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item v-else :key="item.text" link>
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title @click="menuclick(item.text)">{{ item.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
      <v-list>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-logout-variant</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title @click="logout">Logout </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="blue darken-3" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
        <span class="hidden-sm-and-down">{{site.name}}</span>
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon large>
        <v-avatar size="32px" item @click="login">
          <v-img src="https://cdn.vuetifyjs.com/images/logos/logo.svg" alt="Vuetify" />
        </v-avatar>
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container class="fill-height" fluid>
        <v-layout child-flex>
          <h1>{{ msg }}</h1>
          <button @click="login" type="button" v-if="!user">Login with Microsoft</button>
          <button @click="callAPI" type="button" v-if="user">Call Graph's /me API</button>
          <button @click="logout" type="button" v-if="user">Logout</button>
          <h3 v-if="user">Hello {{ user.name }}</h3>
          <pre v-if="userInfo">{{ JSON.stringify(userInfo, null, 4) }}</pre>
          <p v-if="loginFailed">Login unsuccessful</p>
          <p v-if="apiCallFailed">Graph API call unsuccessful</p>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import AuthService from "./services/auth.service";
import GraphService from "./services/graph.service";

export default {
  props: {
    source: String
  },
  data: () => ({
    msg: "Welcome to Your Vue.js + MSAL.js App",
    user: null,
    userInfo: null,
    apiCallFailed: false,
    loginFailed: false,
    site: {},
    dialog: false,
    drawer: false,
    items: [
      { icon: "mdi-contacts", text: "Contacts" },
      { icon: "mdi-history", text: "Frequently contacted" },
      { icon: "mdi-content-copy", text: "Duplicates" },
      {
        icon: "mdi-chevron-up",
        "icon-alt": "mdi-chevron-down",
        text: "Labels",
        model: true,
        children: [{ icon: "mdi-plus", text: "Create label" }]
      },
      {
        icon: "mdi-chevron-up",
        "icon-alt": "mdi-chevron-down",
        text: "More",
        model: false,
        children: [
          { text: "Import" },
          { text: "Export" },
          { text: "Print" },
          { text: "Undo changes" },
          { text: "Other contacts" }
        ]
      },
      { icon: "mdi-settings", text: "Settings" },
      { icon: "mdi-message", text: "Send feedback" },
      { icon: "mdi-help-circle", text: "Help" },
      { icon: "mdi-cellphone-link", text: "App downloads" },
      { icon: "mdi-keyboard", text: "Go to the old version" }
    ]
  }),
  created() {
    this.authService = new AuthService();
    this.graphService = new GraphService();
    this.authService.getToken().then(
      token =>{
        if(!token){
          this.login();
        }else{
          this.callAPI();
        }
      }
    )
  },
  methods: {
    callAPI() {
      this.apiCallFailed = false;
      this.authService.getToken().then(
        token => {
          this.graphService.getUserInfo(token).then(
            data => {
              this.userInfo = data;
            },
            error => {
              // console.error(error);
              this.apiCallFailed = true;
              // this.login();
            }
          );
        },
        error => {
          console.error(error);
          this.apiCallFailed = true;
          // this.login();
        }
      );
    },
    logout() {
      this.authService.logout();
    },
    login() {
      this.loginFailed = false;
      this.authService.login().then(
        user => {
          if (user) {
            this.user = user;
            // alert(user);
          } else {
            this.login();
            this.loginFailed = true;
          }
        },
        error => {
          // alert(error)
          this.loginFailed = true;
        }
      );
    },
    menuclick(txt) {
      alert(txt);
    }
  }
};
</script>