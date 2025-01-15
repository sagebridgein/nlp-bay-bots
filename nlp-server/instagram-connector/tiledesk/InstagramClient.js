

const qs = require("qs"); 
const axios = require("axios").default;
const fs = require("fs");
const FormData = require("form-data");
const path = require("path");
const winston = require("../winston");

class InstagramClient {
  /**
   * Constructor for InstagramClient
   *
   * @example
   * const fbClient = new InstagramClient({ GRAPH_URL: GRAPH_URL, APP_ID: APP_ID, APP_SECRET: APP_SECRET, BASE_URL: BASE_URL });
   *
   * @param {Object} config JSON configuration.
   * @param {string} config.INSTA_GRAPH_URL Mandatory. The api url for facebook.
   * @param {string} config.APP_ID Mandatory. The facebook developer app id.
   * @param {boolean} options.log Optional. If true HTTP requests are logged.
   */
  constructor(config) {
    if (!config.GRAPH_URL) {
      throw new Error("INSTA_GRAPH_URL is mandatory.");
    }
    if (!config.FB_APP_ID) {
      throw new Error("APP_ID is mandatory.");
    }
    if (!config.APP_SECRET) {
      throw new Error("config.APP_SECRET is mandatory");
    }
    if (!config.BASE_URL) {
      throw new Error("config.BASE_URL is mandatory");
    }
    this.insta_api_url = config.GRAPH_URL;
    this.insta_graph_url="https://graph.instagram.com/v21.0/"
    this.app_id = config.FB_APP_ID;
    this.app_secret = config.APP_SECRET;
    this.base_url = config.BASE_URL;
  }
  async send(message, access_token) {
    winston.debug("(fbm) [InstagramClient] Sending message...");

    return await axios({
      url: this.insta_graph_url + "me/messages",
      header: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`
      },
      method: "POST",
      data: message,
    })
      .then((response) => {
        winston.debug("(fbm) [InstagramClient] Message sent!");
        return response;
      })
      .catch((err) => {
        winston.error(
          "(fbm) [InstagramClient] error send message: ",
          err.response.data
        );
        throw err;
      });
  }
  async getAccessTokenFromCode(code, callback) {
    console.log("Code received:", code);
  
    try {
      // Prepare the parameters
      const params = {
        grant_type: "authorization_code",
        client_secret: this.app_secret,
        client_id: this.app_id,
        redirect_uri: this.base_url + '/oauth',
        code: code,
      };
  
      // Convert parameters to x-www-form-urlencoded format
      const formData = qs.stringify(params);
  
      const URL = `${this.insta_api_url}oauth/access_token`;
  
      // Make the POST request
      const response = await axios.post(
        URL,
        formData, // Send encoded parameters in the body
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
  
      console.log("Access token received:", response.data);
  
      // Call the callback if provided
      if (callback) {
        callback(null, response.data.access_token);
      }
  
      return response.data.access_token;
  
    } catch (error) {
      console.error("Error during token retrieval:", error);
  
      // Call the callback with error if provided
      if (callback) {
        callback(error);
      }
  
      throw error; // Rethrow the error for further handling
    }
  }
  
  async messageEventSubscription(app_id, access_token) {
    return await axios({
      url: this.insta_graph_url + app_id + "/subscribed_apps?access_token=" + access_token + "&subscribed_fields=['messages','comments','mentions']",
      method: "POST"
    }).then((response) => {
      winston.debug("(fbm) [FacebookClient] event subscription resbody: ", response);
      return response
    }).catch((err) => {
      winston.error("(fbm) [FacebookClient] event subscription error: ", err)
    })
  }
  async getUserInfo(access_token, user_id) {

    return await axios({
      url: this.insta_graph_url + user_id + "?access_token=" + access_token,
      method: 'GET'
    }).then((response) => {
      winston.debug("(fbm) [InstagramClient] get user info response: ", response.data);
      return response.data;
    }).catch((err) => {
      winston.error("(fbm) [InstagramClient] get user info err: ", err.response.data);
    })
  }
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
      winston.error("(fbm) [InstagramClient] An error occured: ", err);
      if (callback) {
        callback(err, null, null);
      }
    })
  }
  getInstagramBusinessAccount = async (accessToken) => {
    try {
      const response = await axios.get(`${this.insta_graph_url}me?fields=account_type,username,user_id,followers_count,follows_count,media_count&access_token=${accessToken}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching Instagram business account:", error);
      throw error;
    }
  };

}


module.exports = { InstagramClient }