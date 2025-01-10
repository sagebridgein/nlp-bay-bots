const axios = require("axios").default;
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');
const winston = require('../winston');

class FacebookClient {
  /**
    * Constructor for FacebookClient
    *
    * @example
    * const fbClient = new FacebookClient({ GRAPH_URL: GRAPH_URL, APP_ID: APP_ID, APP_SECRET: APP_SECRET, BASE_URL: BASE_URL });
    * 
    * @param {Object} config JSON configuration.
    * @param {string} config.GRAPH_URL Mandatory. The api url for facebook.
    * @param {string} config.APP_ID Mandatory. The facebook developer app id.
    * @param {boolean} options.log Optional. If true HTTP requests are logged.
    */

  constructor(config) {
    if (!config) {
      throw new Error('config is mandatory');
    }

    if (!config.GRAPH_URL) {
      throw new Error('config.GRAPH_URL is mandatory');
    }

    if (!config.FB_APP_ID) {
      throw new Error('config.APP_ID is mandatory')
    }

    if (!config.APP_SECRET) {
      throw new Error('config.APP_SECRET is mandatory')
    }

    if (!config.BASE_URL) {
      throw new Error('config.BASE_URL is mandatory')
    }

    this.graph_url = config.GRAPH_URL;
    this.app_id = config.FB_APP_ID;
    this.app_secret = config.APP_SECRET;
    this.base_url = config.BASE_URL;
  }

  async send(message, page_access_token) {
  
    winston.debug("(fbm) [FacebookClient] Sending message...");
    
    return await axios({
      url: this.graph_url + "me/messages?access_token=" + page_access_token,
      header: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      data: message
    }).then((response) => {
      winston.debug("(fbm) [FacebookClient] Message sent!");
      return response
    }).catch((err) => {
      winston.error("(fbm) [FacebookClient] error send message: ", err.response.data);
      throw err;
    })
  }

  async getAccessTokenFromCode(code, callback) {

    const params = {
      client_id: this.app_id,
      client_secret: this.app_secret,
      redirect_uri: this.base_url + '/oauth',
      code: code
    }

    const URL = this.graph_url + 'oauth/access_token';
    //const URL = "https://graph.facebook.com/v9.0/oauth/access_token";
    const HTTPREQUEST = {
      url: URL,
      headers: {
        'Content-Type': 'application/json',
      },
      params: params,
      json: true,
      method: 'GET'
    }
    let promise = new Promise((resolve, reject) => {
      FacebookClient.myrequest(
        HTTPREQUEST,
        function(err, resbody) {
          if (err) {
            if (callback) {
              callback(err);
            }
            reject(err);
          }
          else {
            if (callback) {
              callback(null, resbody);
            }
            resolve(resbody.access_token);
          }
        }, true)
    })
    return promise;
  }

  async getPages(access_token, callback) {

    const params = {
      access_token: access_token
    }

    const URL = this.graph_url + 'me/accounts';
    const HTTPREQUEST = {
      url: URL,
      headers: {
        'Content-Type': 'application/json',
      },
      params: params,
      method: 'GET'
    }
    let promise = new Promise((resolve, reject) => {
      FacebookClient.myrequest(
        HTTPREQUEST,
        function(err, resbody) {
          if (err) {
            if (callback) {
              callback(err);
            }
            reject(err);
          }
          else {
            if (callback) {
              callback(null, resbody);
            }
            resolve(resbody.data);
          }
        }, true)
    })
    return promise;
  }

  async messageEventSubscription(page_id, access_token) {

    return await axios({
      url: this.graph_url + page_id + "/subscribed_apps?access_token=" + access_token + "&subscribed_fields=['messages', 'messaging_postbacks']",
      method: "POST"
    }).then((response) => {
      winston.debug("(fbm) [FacebookClient] event subscription resbody: ", response);
      return response
    }).catch((err) => {
      winston.error("(fbm) [FacebookClient] event subscription error: ", err)
    })

    /*
    let promise = new Promise((resolve, reject) => {
      
      request({
        url: `${this.graph_url}/${page_id}/subscribed_apps?access_token=${access_token}&subscribed_fields=messages`,
        method: 'POST'
      }, (err, res, resbody) => {
        if (err) {
          reject(err)
        } else {
          resolve(resbody)
        }
      })
    })
    return promise;
    */
  }

  async getUserInfo(access_token, user_id) {

    return await axios({
      url: this.graph_url + user_id + "?access_token=" + access_token,
      method: 'GET'
    }).then((response) => {
      winston.debug("(fbm) [FacebookClient] get user info response: ", response.data);
      return response.data;
    }).catch((err) => {
      winston.error("(fbm) [FacebookClient] get user info err: ", err.response.data);
    })
  }

  // HTTP REQUEST

  static async myrequest(options, callback, log) {
    
    return await axios({
      url: options.url,
      method: options.method,
      data: options.json,
      params: options.params,
      headers: options.headers
    }).then((res) => {
      if (res && res.status == 200 && res.data) {
        if (callback) {
          callback(null, res.data);
        }
      }
      else {
        if (callback) {
          callback({ message: "Response status not 200", data: res.data }, null, null);
        }
      }
    }).catch((err) => {
      winston.error("(fbm) [FacebookClient] An error occured: ", err);
      if (callback) {
        callback(err, null, null);
      }
    })
  }
  
}

module.exports = { FacebookClient }