const axios = require("axios").default;
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const winston = require('../winston');

class TiledeskChannel {

  /**
    * Constructor for TiledeskChannel
    *
    * @example
    * const { TiledeskChannel } = require('tiledesk-channel');
    * const tdChannel = new TiledeskChannel({tiledeskJsonMessage: replyFromWhatsapp, settings: appSettings, whatsappJsonMessage: originalWhatsappMessage, API_URL: tiledeskApiUrl });
    * 
    * @param {Object} config JSON configuration.
    * @param {string} config.tiledeskJsonMessage Mandatory. Message translated from Whatsapp to Tiledesk
    * @param {string} config.whatsappJsonMessage Mandatory. Original whatsapp message.
    * @param {string} config.settings Mandatory. Installation settings.
    * @param {string} config.API_URL Mandatory. Tiledesk api url.
    * @param {boolean} options.log Optional. If true HTTP requests are logged.
    */
  
  constructor(config) {
    if (!config) {
      throw new Error('config is mandatory');
    }

    if (!config.settings) {
      throw new Error('config.settings is mandatory');
    }

    if (!config.API_URL) {
      throw new Error('config.API_URL is mandatory');
    }

    this.settings = config.settings;
    this.API_URL = config.API_URL;

  }

  async send(tiledeskMessage, messageInfo, department_id) {

    let channel;
    let new_request_id;

    if (department_id) {
      tiledeskMessage.departmentid = department_id;
    }

    if (messageInfo.channel == "whatsapp") {
      channel = messageInfo.whatsapp;
      new_request_id = "support-group-" + this.settings.project_id + "-" + uuidv4().substring(0, 8) + "-wab-" + channel.phone_number_id + "-" + channel.from;

    } else if (messageInfo.channel == "telegram") {
      channel = messageInfo.telegram;

    } else if (messageInfo.channel == "messenger") {
      channel = messageInfo.messenger;
      new_request_id = "support-group-" + this.settings.project_id + "-" + uuidv4().substring(0, 8) + "-fbm-" + channel.page_id + "-" + channel.sender_id;

    }else if (messageInfo.channel == "instagram"){
      channel = messageInfo.instagram;
      new_request_id = "support-group-" + this.settings.project_id + "-" + uuidv4().substring(0, 8) + "-ibm-" + channel.user_id + "-" + channel.sender_id;

   } else {
      winston.verbose("[(fbm) TiledeskChannel] Channel not supported")
    }


    var payload = {
      _id: 'ibm-' + channel.sender_id,
      first_name: channel.firstname,
      last_name: channel.lastname,
      email: 'na@instagram.com',
      sub: 'userexternal',
      aud: 'https://tiledesk.com/subscriptions/' + this.settings.subscription_id
    }

    var customToken = jwt.sign(payload, this.settings.secret);

    return await axios({
      url: this.API_URL + "/auth/signinWithCustomToken",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "JWT " + customToken
      },
      data: {},
      method: 'POST'
    }).then( async (response) => {

      let token = response.data.token;
      token = this.fixToken(token);

      return await axios({
        url: this.API_URL + `/${this.settings.project_id}/requests/me?channel=${messageInfo.channel}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        method: 'GET'
      }).then( async (response) => {

        winston.debug("(fbm) [TiledeskChannel] get request response: ", response.data);

        let request_id;
        if (response.data.requests[0]) {
          request_id = response.data.requests[0].request_id;
          winston.debug("(fbm) [TiledeskChannel] Old request id: " + request_id);
        } else {
          request_id = new_request_id;
          winston.debug("(fbm) [TiledeskChannel] New request id: " + request_id);
        }

        winston.debug("(fbm) [TiledeskChannel] tiledeskMessage:", tiledeskMessage);
        
        return await axios({
          url: this.API_URL + `/${this.settings.project_id}/requests/${request_id}/messages`,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          data: tiledeskMessage,
          method: 'POST'
        }).then( async (response) => {
          winston.debug("(fbm) [TiledeskChannel] send message response: ", response.data);  
          return response.data;
          
        }).catch((err) => {
          winston.error("(fbm) [TiledeskChannel] send message error: ", err);
        })
        
      }).catch((err) => {
        winston.error("(fbm) [TiledeskChannel] get requests error: ", err);
      })

    }).catch((err) => {
      winston.error("(fbm) [TiledeskChannel] sign in error: ", err);
    })
  }


  async getDepartments() {

    return await axios({
      url: this.API_URL + "/" + this.settings.project_id + "/departments/allstatus",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.settings.token 
      },
      method: 'GET'
    }).then((response) => {
      winston.debug("(fbm) [TiledeskChannel] get departments: ", response.data)
      return response.data;
    }).catch((err) => {
      winston.error("(fbm) [TiledeskChannel] get departments error: ", err);
    })
  }

  async sendAndAddBot(tiledeskMessage, messageInfo, bot_id) {
    
    let channel;
    let new_request_id;
    tiledeskMessage.participants = ["bot_" + bot_id]

    if (messageInfo.channel == "whatsapp") {
      channel = messageInfo.whatsapp;
      new_request_id = "support-group-" + this.settings.project_id + "-" + uuidv4().substring(0, 8) + "-wab-" + channel.phone_number_id + "-" + channel.from;
    } else {
      winston.verbose("(fbm) [TiledeskChannel] Channel not supported")
      return null;
    }

    var payload = {
      _id: 'wab-' + channel.from,
      first_name: channel.firstname,
      last_name: channel.lastname,
      email: 'na@whatsapp.com',
      sub: 'userexternal',
      aud: 'https://tiledesk.com/subscriptions/' + this.settings.subscriptionId
    }

    var customToken = jwt.sign(payload, this.settings.secret);

    return await axios({
      url: this.API_URL + "/auth/signinWithCustomToken",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + customToken
      },
      data: {},
      method: 'POST'
    }).then((response) => {
      
      let token = response.data.token;
      token = this.fixToken(token);

      return axios({
        url: this.API_URL + `/${this.settings.project_id}/requests/${new_request_id}/messages`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        data: tiledeskMessage,
        method: 'POST'
      }).then((response) => {
        return response.data
      }).catch((err) => {
        winston.error("(fbm) [TiledeskChannel] send message error (open conversation): ", err);
      })
    }).catch((err) => {
      winston.error("(fbm) [TiledeskChannel] sign in error: ", err);
    })
  }

    async getProjectDetail() {

    return await axios({
      url: this.API_URL + '/projects/' + this.settings.project_id,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.settings.token
      },
      method: 'GET'
    }).then((response) => {
      return this.checkPlan(response.data);
    }).catch((err) => {
      winston.error("(wab) [TiledeskChannel] get project detail error: ", err);
      return null;
    })
  }

  checkPlan(project) {
    let profile_name = project.profile.name;
    let profile_type = project.profile.type;
    let isActiveSubscription = project.isActiveSubscription;
    let trialExpired = project.trialExpired;

    winston.debug("profile_name: " + profile_name)
    winston.debug("profile_type: " + profile_type)
    winston.debug("isActiveSubscription: " + isActiveSubscription)
    
    return new Promise((resolve, reject) => {
      if (
        ((profile_name === 'Growth' || profile_name === 'Basic')) ||
        ((profile_name === 'Scale' || profile_name === 'Premium') && isActiveSubscription === false) ||
        ((profile_name === 'Plus' || profile_name === 'Custom') && isActiveSubscription === false) ||
        (profile_type === 'free' && trialExpired === true) 
      ) {
        winston.verbose('Feature not available')
        resolve(false);

      } else if (
        ((profile_name === 'Scale' || profile_name === 'Premium') && isActiveSubscription === true) ||
        ((profile_name === 'Plus' || profile_name === 'Custom') && isActiveSubscription === true) ||
        (profile_type === 'free' && trialExpired === false)
      ) {
        winston.verbose('Feature available')
        resolve(true);
        
      } else {
        winston.verbose('Other case: feature not available');
        resolve(false);
      }
    })
  }
  
  fixToken(token) {
    
    let index = token.lastIndexOf("JWT ");
    if (index != -1) {
      let new_token = token.substring(index + 4);
      return 'JWT ' + new_token;
    } else {
      return 'JWT ' + token;
    }
    
  }
  

}

module.exports = { TiledeskChannel }