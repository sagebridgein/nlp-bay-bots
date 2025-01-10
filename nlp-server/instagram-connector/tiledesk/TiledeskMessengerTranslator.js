const { v4: uuidv4 } = require('uuid');
const { TiledeskChannel } = require('./TiledeskChannel');
const winston = require('../winston');

class TiledeskMessengerTranslator {

  /**
   * Constructor for TiledeskWhatsappTranslator
   *const axios = require("axios").default;
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');
   * @example
   * const { TiledeskWhatsappTranslator } = require('tiledesk-whatsapp-translator');
   * const tlr = new TiledeskWhatsappTranslator();
   * 
   * @param {Object} config JSON configuration.
   */

  static MESSENGER_MESSAGING_PRODUCT = "instagram";
  static CHANNEL_NAME = "instagram";

  constructor() {


    /*
    if (!config.tiledeskChannelMessage) {
      throw new Error('config.tiledeskChannelMessage is mandatory');
    }
    this.tiledeskChannelMessage = config.tiledeskChannelMessage;
    */

  }


  /*
  *************** START ***************
  ******** FACEBOOK MESSENGER *********
  *************************************
  */
  toMessenger(tiledeskChannelMessage, messenger_receiver) {

    winston.debug("(fbm) [Translator] tiledeskChannelMessage: ", tiledeskChannelMessage)

    let text = '';
    if (tiledeskChannelMessage.text) {
      text = tiledeskChannelMessage.text;
      //text = tiledeskChannelMessage.text.replace(/-{1,}/g, '');
      //text = text.replace(/\*{2,}/g, '*')
    }

    let messenger_message = {
      //messaging_product: TiledeskMessengerTranslator.MESSENGER_MESSAGING_PRODUCT,
      recipient: { id: messenger_receiver }
    }

    if (tiledeskChannelMessage.type === 'frame') {
      text = text + "\n\n👉 " + tiledeskChannelMessage.metadata.src
      messenger_message.message = {
        text: text
      };
      return messenger_message
    }

    else if (tiledeskChannelMessage.metadata) {


      if ((tiledeskChannelMessage.metadata.type && tiledeskChannelMessage.metadata.type.startsWith('image')) || tiledeskChannelMessage.type.startsWith('image')) {

        messenger_message.message = {
          attachment: {
            type: "image",
            payload: {
              url: tiledeskChannelMessage.metadata.src,
              is_reusable: true
            }
          }
        }
      }

      else if ((tiledeskChannelMessage.metadata.type && tiledeskChannelMessage.metadata.type.startsWith('video')) || tiledeskChannelMessage.type.startsWith('video')) {

        messenger_message.message = {
          attachment: {
            type: "template",
            payload: {
              template_type: "open_graph",
              elements: [
                {
                  //media_type: "video",
                  url: tiledeskChannelMessage.metadata.src
                  //url: tiledeskChannelMessage.metadata.src
                  //url: // facebook url: 
                  // https://developers.facebook.com/docs/messenger-platform/send-messages/template/media
                  // https://developers.facebook.com/docs/messenger-platform/reference/attachment-upload-api
                }
              ]
            }
          }
        }

        /*
        messenger_message.type = 'video'
        messenger_message.video = {
          link: tiledeskChannelMessage.metadata.src,
          //caption: tiledeskChannelMessage.metadata.name || tiledeskChannelMessage.text
        }

        */
      }

      else if (tiledeskChannelMessage.metadata.type && tiledeskChannelMessage.metadata.type.startsWith('application')) {

        messenger_message.type = 'document'
        messenger_message.document = {
          link: tiledeskChannelMessage.metadata.src,
          caption: tiledeskChannelMessage.metadata.name || tiledeskChannelMessage.text
        }
      }

      else {
        winston.verbose("(fbm) [Translator] file type not supported")
        return null
      }

      winston.debug("(fbm) [Translator] messenger_message: " + messenger_message)
      return messenger_message;

    } else if (tiledeskChannelMessage.attributes) {
      if (tiledeskChannelMessage.attributes.attachment) {
        if (tiledeskChannelMessage.attributes.attachment.buttons) {

          let buttons = tiledeskChannelMessage.attributes.attachment.buttons;

          let quick_replies = [];
          let actions = [];

          if (buttons.length == 0) {
            messenger_message.message = {
              text: text
            };
            return messenger_message;
          }

          for (let btn of buttons) {

            if (btn.type == 'text') {
              let quick_reply = {
                content_type: 'text',
                title: btn.value,
                payload: btn.value
              }
              quick_replies.push(quick_reply)
            }

            if (btn.type == 'action') {
              let action = {
                type: "postback",
                title: btn.value,
                payload: btn.action
              }
              actions.push(action);
            }

            if (btn.type == 'url') {
              let web_url = {
                type: "web_url",
                title: btn.value,
                url: btn.link
              }
              actions.push(web_url);
            }

          }

          messenger_message.messaging_type = "RESPONSE";
          messenger_message.message = {};
          if (actions.length > 0) {
            if (actions.length > 3) {
              winston.warn("(fbm) [Translator] Number of action buttons exceeds the Facebook limit of 3. Excess buttons will be ignored.")
              actions.length = 3;
            }
            messenger_message.message.attachment = {
              type: "template",
              payload: {
                template_type: "button",
                text: text,
                buttons: actions
              }
            }
          }

          if (quick_replies.length > 0) {
            messenger_message.message.text = text;
            if (quick_replies.length > 13) {
              winston.warn("(fbm) [Translator] Number of quick replies exceeds the Facebook limit of 13. Excess replies will be ignored.")
              quick_replies.length = 13;
            }
            messenger_message.message.quick_replies = quick_replies;
          }

          if (quick_replies.length > 0 && actions.length > 0) {
            delete messenger_message.message.text;
          }


          return messenger_message;



        } 

        else if (tiledeskChannelMessage.attributes.attachment.gallery) {
          winston.warn("(fbm) [Translator] Messages of type 'gallery' are not supported.")
          return null; 
        }
        
        else {

          messenger_message.message = {
            text: text
          };

          winston.debug("(fbm) [Translator] messenger_message: ", messenger_message)
          return messenger_message;
        }

      } else {

        messenger_message.message = {
          text: text
        };

        winston.debug("(fbm) [Translator] simple whatsapp message: ", messenger_message)
        return messenger_message;
      }

    } else {
      messenger_message.message = {
        text: text
      };

      winston.debug("(fbm) [Translator] whatsapp message: ", messenger_message)
      return messenger_message;
    }
  }

  async toTiledesk(messengerChannelMessage) {

    winston.debug("(fbm) [Translator] messengerChannelMessage: ", messengerChannelMessage);

    let tiledeskMessage = {
      senderFullname: messengerChannelMessage.sender.fullname,
      channel: { name: TiledeskMessengerTranslator.CHANNEL_NAME }
    }

    if (messengerChannelMessage.postback) {
      tiledeskMessage.text = "",
        tiledeskMessage.type = 'text',
        tiledeskMessage.attributes = {
          action: messengerChannelMessage.postback.payload,
          subtype: 'info'
        }
      return tiledeskMessage;
    }

    else if (messengerChannelMessage.message) {
      if (messengerChannelMessage.message.attachments) {

        if (messengerChannelMessage.message.attachments[0]) {
          let attachment = messengerChannelMessage.message.attachments[0];

          if (attachment.type === "image") {

            tiledeskMessage.type = 'image';
            tiledeskMessage.text = messengerChannelMessage.message.text || "Attached image";
            tiledeskMessage.metadata = {
              src: attachment.payload.url
            }
            return tiledeskMessage;

          } else if (attachment.type === "video") {
            tiledeskMessage.text = "[Download video](" + attachment.payload.url + ")";
            tiledeskMessage.type = "file";
            tiledeskMessage.metadata = {
              src: attachment.payload.url,
              name: "video.mp4",
              type: "video/mp4"
            }
            return tiledeskMessage

          } else if (attachment.type === "file") {
            tiledeskMessage.type = "file";
            tiledeskMessage.text = "[Download document](" + attachment.payload.url + ")";
            tiledeskMessage.metadata = {
              src: attachment.payload.url,
              name: "document.pdf",
              type: "application/pdf"
            }
            return tiledeskMessage

          } else {
            winston.verbose("(fbm) Attachment type not supported.");
          }

        }

      } else if (messengerChannelMessage.message.quick_reply) {
        tiledeskMessage.text = messengerChannelMessage.message.quick_reply.payload;
        return tiledeskMessage;
      } else {
        tiledeskMessage.text = messengerChannelMessage.message.text;
        return tiledeskMessage;
      }

    } else {
      winston.verbose("(fbm) message type not supported");
      return null;
    }

  }


  /*
  async toTiledeskOld(messengerChannelMessage, message_info, settings, API_URL) {

    if (this.log) {
      console.log("(fbm) [Translator] messenger message: ", JSON.stringify(messengerChannelMessage));
    }

    let tiledeskMessage = {
      senderFullname: messengerChannelMessage.sender.fullname,
      channel: { name: TiledeskMessengerTranslator.CHANNEL_NAME }
    }

    if (messengerChannelMessage.postback) {
      tiledeskMessage.text = ' ',
      tiledeskMessage.type = 'text',
      tiledeskMessage.attributes = {
        action: messengerChannelMessage.postback.payload,
        subtype: 'info'
      }
      return tiledeskMessage;
    }

    else if (messengerChannelMessage.message) {

      // attachments
      if (messengerChannelMessage.message.attachments) {

        const tdChannel = new TiledeskChannel({ settings: settings, API_URL: API_URL })

        for (let attachment of messengerChannelMessage.message.attachments) {

          // image
          if (attachment.type === "image") {
             TiledeskMessengerTranslator.getImageSize(attachment.payload.url).then( async (size) => {
                tiledeskMessage.type = 'image';
                tiledeskMessage.text = messengerChannelMessage.message.text || "Attached image";
                tiledeskMessage.metadata = {
                  src: attachment.payload.url,
                  width: size.width,
                  height: size.height
                }
                const response = await tdChannel.send(tiledeskMessage, message_info, settings.department_id);
                if (this.log) {
                  console.log("(messenger) /messenger Send response: ", response)
                }
            }).catch((err) => {
              console.error("error getting image size: ", err)
            })

          // video
          } else if (attachment.type === 'video') {
            tiledeskMessage.text = "[Download video](" + attachment.payload.url + ")";
            tiledeskMessage.type = "file";
            tiledeskMessage.metadata = {
              src: attachment.payload.url,
              name: "video.mp4",
              type: "video/mp4"
            }
            const response = await tdChannel.send(tiledeskMessage, message_info, settings.department_id);
            if (this.log) {
              console.log("(messenger) /messenger Send response: ", response)
            }

          // file
          } else if (attachment.type === 'file') {
            tiledeskMessage.type = "file";
            tiledeskMessage.text = "[Dowload document](" + attachment.payload.url + ")";
            tiledeskMessage.metadata = {
              src: attachment.payload.url,
              name: "document.pdf",
              type: "application/pdf"
            }

            const response = await tdChannel.send(tiledeskMessage, message_info, settings.department_id);
            if (this.log) {
              console.log("(messenger) /messenger Send response: ", response)
            }
            
          // others
          } else {
            console.log("attachment type not supported: ", attachment.type)
          }

        }

        return true;
        
      }  

      else if (messengerChannelMessage.message.quick_reply) {
        tiledeskMessage.text = messengerChannelMessage.message.quick_reply.payload;
        return tiledeskMessage;
      } 

      else {
        tiledeskMessage.text = messengerChannelMessage.message.text;
        return tiledeskMessage;
      }      
    }

    else {
      console.log("message type not supported")
      return null
    }

  }
  */

  static async getImageSize(url) {

    return new Promise((resolve, reject) => {
      probe(url).then((size) => {
        resolve(size);
      }).catch((err) => {
        reject(err);
      })
    })
    //return await probe(url);
  }
  /*
  *************************************
  ********* FACEBOOK MESSENGER *********
  **************** END ****************
  */

}

module.exports = { TiledeskMessengerTranslator };

