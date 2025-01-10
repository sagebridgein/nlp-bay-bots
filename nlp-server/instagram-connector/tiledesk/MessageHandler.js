const axios = require("axios").default;
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const winston = require('../winston');

class MessageHandler {

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

    /*
    if (!config) {
      throw new Error('config is mandatory');
    }

    if (!config.tiledeskChannelMessage) {
      throw new Error('config.tiledeskChannelMessage is mandatory');
    }
    */

    if (config) {
      if (config.tiledeskChannelMessage) {
        this.tiledeskChannelMessage = config.tiledeskChannelMessage;
      } else {
        winston.verbose("Missing config.tiledeskChannelMessage")
      }
    }
    
    this.log = false;

  }

  async generateMessageObject(command) {
    winston.debug("(fbm) [MessageHandler] command: ", command);

    let tiledeskCommandMessage = command.message;
    tiledeskCommandMessage.recipient = this.tiledeskChannelMessage.recipient;
    
    return tiledeskCommandMessage;
  }

  async splitMessageFromTiledesk(tiledeskMessage) {

    winston.debug("(fbm) [MessageHandler] split message tiledeskMessage: ", tiledeskMessage);
    
    return new Promise((resolve, reject) => {

      let messagesList = [];

      if (tiledeskMessage.metadata) {
        let message = Object.assign({}, tiledeskMessage);
        delete message.text;       

        messagesList.push(message)

        if (tiledeskMessage.text != null && tiledeskMessage.text != "") {
          message = Object.assign({}, tiledeskMessage);
          delete message.metadata;
          message.type = "text";

          messagesList.push(message);
          resolve(messagesList);
        } else {
          resolve(messagesList);
        }
      } else {
        messagesList.push(tiledeskMessage);
        resolve(messagesList);
      }
      
    })
  }

  async splitMessageFromMessenger(messengerMessage) {

    winston.debug("(fbm) [MessageHandler] split message messengerMessage: ", messengerMessage);
    
    let messagesList = [];
    return new Promise((resolve, reject) => {

      let attachments = messengerMessage.message.attachments;
      attachments.forEach((attachment) => {
        let message = JSON.parse(JSON.stringify(messengerMessage));
        delete message.message.attachments;
        message.message.attachments = [ attachment ];

        messagesList.push(message);
      })
      resolve(messagesList);
      
    })
  }
  

  /*
  generateMessageObjectOriginal(command_message) {
      let parentUid = this.tiledeskChannelMessage.uid
      //command_message.uid = this.tiledeskChannelMessage.uid + "_" + index;
      command_message.uid = this.tiledeskChannelMessage.uid;
      if(command_message.text) command_message.text = command_message.text.trim()//remove black msg with only spaces
      command_message.language = message.language;
      command_message.recipient = message.recipient;
      command_message.recipient_fullname = message.recipient_fullname;
      command_message.sender = message.sender;
      command_message.sender_fullname = message.sender_fullname;
      command_message.channel_type = message.channel_type;
      command_message.status = message.status;
      command_message.isSender = message.isSender;
      command_message.attributes? command_message.attributes.commands = true : command_message.attributes = {commands : true}
      command_message.attributes.parentUid = parentUid //added to manage message STATUS UPDATES
      command_message.attributes = {...message.attributes, ...command_message.attributes}
      //this.addedNew(command_message)
      //callback();

    return command_message
  }
  */

  

}

module.exports = { MessageHandler }

