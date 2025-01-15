const { v4: uuidv4 } = require("uuid");
const { TiledeskChannel } = require("./TiledeskChannel");
const winston = require("../winston");

class TiledeskInstagramTranslator {
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

  static instagram_MESSAGING_PRODUCT = "instagram";
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
   ******** Instagram *********
   *************************************
   */
  toinstagram(tiledeskChannelMessage, instagram_receiver) {
    winston.debug(
      "(fbm) [Translator] tiledeskChannelMessage: ",
      tiledeskChannelMessage
    );

    let text = "";
    if (tiledeskChannelMessage.text) {
      text = tiledeskChannelMessage.text;
      //text = tiledeskChannelMessage.text.replace(/-{1,}/g, '');
      //text = text.replace(/\*{2,}/g, '*')
    }

    let instagram_message = {
      //messaging_product: TiledeskinstagramTranslator.instagram_MESSAGING_PRODUCT,
      recipient: { id: instagram_receiver },
    };

    if (tiledeskChannelMessage.type === "frame") {
      text = text + "\n\n👉 " + tiledeskChannelMessage.metadata.src;
      instagram_message.message = {
        text: text,
      };
      return instagram_message;
    } else if (tiledeskChannelMessage.metadata) {
      if (
        (tiledeskChannelMessage.metadata.type &&
          tiledeskChannelMessage.metadata.type.startsWith("image")) ||
        tiledeskChannelMessage.type.startsWith("image")
      ) {
        instagram_message.message = {
          attachment: {
            type: "image",
            payload: {
              url: tiledeskChannelMessage.metadata.src,
              is_reusable: true,
            },
          },
        };
      } else if (
        (tiledeskChannelMessage.metadata.type &&
          tiledeskChannelMessage.metadata.type.startsWith("video")) ||
        tiledeskChannelMessage.type.startsWith("video")
      ) {
        instagram_message.message = {
          attachment: {
            type: "template",
            payload: {
              template_type: "open_graph",
              elements: [
                {
                  //media_type: "video",
                  url: tiledeskChannelMessage.metadata.src,
                  //url: tiledeskChannelMessage.metadata.src
                  //url: // facebook url:
                  // https://developers.facebook.com/docs/instagram-platform/send-messages/template/media
                  // https://developers.facebook.com/docs/instagram-platform/reference/attachment-upload-api
                },
              ],
            },
          },
        };
      } else if (
        tiledeskChannelMessage.metadata.type &&
        tiledeskChannelMessage.metadata.type.startsWith("application")
      ) {
        instagram_message.type = "document";
        instagram_message.document = {
          link: tiledeskChannelMessage.metadata.src,
          caption:
            tiledeskChannelMessage.metadata.name || tiledeskChannelMessage.text,
        };
      } else {
        winston.verbose("(fbm) [Translator] file type not supported");
        return null;
      }

      winston.debug(
        "(fbm) [Translator] instagram_message: " + instagram_message
      );
      return instagram_message;
    } else if (tiledeskChannelMessage.attributes) {
      if (tiledeskChannelMessage.attributes.attachment) {
        if (tiledeskChannelMessage.attributes.attachment.buttons) {
          let buttons = tiledeskChannelMessage.attributes.attachment.buttons;

          let quick_replies = [];
          let actions = [];

          if (buttons.length == 0) {
            instagram_message.message = {
              text: text,
            };
            return instagram_message;
          }

          for (let btn of buttons) {
            if (btn.type == "text") {
              let quick_reply = {
                content_type: "text",
                title: btn.value,
                payload: btn.value,
              };
              quick_replies.push(quick_reply);
            }

            if (btn.type == "action") {
              let action = {
                type: "postback",
                title: btn.value,
                payload: btn.action,
              };
              actions.push(action);
            }

            if (btn.type == "url") {
              let web_url = {
                type: "web_url",
                title: btn.value,
                url: btn.link,
              };
              actions.push(web_url);
            }
          }

          instagram_message.messaging_type = "RESPONSE";
          instagram_message.message = {};
          if (actions.length > 0) {
            if (actions.length > 3) {
              winston.warn(
                "(fbm) [Translator] Number of action buttons exceeds the Facebook limit of 3. Excess buttons will be ignored."
              );
              actions.length = 3;
            }
            instagram_message.message.attachment = {
              type: "template",
              payload: {
                template_type: "button",
                text: text,
                buttons: actions,
              },
            };
          }

          if (quick_replies.length > 0) {
            instagram_message.message.text = text;
            if (quick_replies.length > 13) {
              winston.warn(
                "(fbm) [Translator] Number of quick replies exceeds the Facebook limit of 13. Excess replies will be ignored."
              );
              quick_replies.length = 13;
            }
            instagram_message.message.quick_replies = quick_replies;
          }

          if (quick_replies.length > 0 && actions.length > 0) {
            delete instagram_message.message.text;
          }

          return instagram_message;
        } else if (tiledeskChannelMessage.attributes.attachment.gallery) {
          winston.warn(
            "(fbm) [Translator] Messages of type 'gallery' are not supported."
          );
          return null;
        } else {
          instagram_message.message = {
            text: text,
          };

          winston.debug(
            "(fbm) [Translator] instagram_message: ",
            instagram_message
          );
          return instagram_message;
        }
      } else {
        instagram_message.message = {
          text: text,
        };

        winston.debug(
          "(fbm) [Translator] simple whatsapp message: ",
          instagram_message
        );
        return instagram_message;
      }
    } else {
      instagram_message.message = {
        text: text,
      };

      winston.debug("(fbm) [Translator] whatsapp message: ", instagram_message);
      return instagram_message;
    }
  }

  async toTiledesk(instagramChannelMessage) {
    winston.debug(
      "(fbm) [Translator] instagramChannelMessage: ",
      instagramChannelMessage
    );

    let tiledeskMessage = {
      senderFullname: instagramChannelMessage.sender.fullname,
      channel: { name: TiledeskInstagramTranslator.CHANNEL_NAME },
    };

    if (instagramChannelMessage.postback) {
      (tiledeskMessage.text = ""),
        (tiledeskMessage.type = "text"),
        (tiledeskMessage.attributes = {
          action: instagramChannelMessage.postback.payload,
          subtype: "info",
        });
      return tiledeskMessage;
    } else if (instagramChannelMessage.message) {
      if (instagramChannelMessage.message.attachments) {
        if (instagramChannelMessage.message.attachments[0]) {
          let attachment = instagramChannelMessage.message.attachments[0];

          if (attachment.type === "image") {
            tiledeskMessage.type = "image";
            tiledeskMessage.text =
              instagramChannelMessage.message.text || "Attached image";
            tiledeskMessage.metadata = {
              src: attachment.payload.url,
            };
            return tiledeskMessage;
          } else if (attachment.type === "video") {
            tiledeskMessage.text =
              "[Download video](" + attachment.payload.url + ")";
            tiledeskMessage.type = "file";
            tiledeskMessage.metadata = {
              src: attachment.payload.url,
              name: "video.mp4",
              type: "video/mp4",
            };
            return tiledeskMessage;
          } else if (attachment.type === "file") {
            tiledeskMessage.type = "file";
            tiledeskMessage.text =
              "[Download document](" + attachment.payload.url + ")";
            tiledeskMessage.metadata = {
              src: attachment.payload.url,
              name: "document.pdf",
              type: "application/pdf",
            };
            return tiledeskMessage;
          } else {
            winston.verbose("(fbm) Attachment type not supported.");
          }
        }
      } else if (instagramChannelMessage.message.quick_reply) {
        tiledeskMessage.text =
          instagramChannelMessage.message.quick_reply.payload;
        return tiledeskMessage;
      } else {
        tiledeskMessage.text = instagramChannelMessage.message.text;
        return tiledeskMessage;
      }
    } else {
      winston.verbose("(fbm) message type not supported");
      return null;
    }
  }

  static async getImageSize(url) {
    return new Promise((resolve, reject) => {
      probe(url)
        .then((size) => {
          resolve(size);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = { TiledeskInstagramTranslator };
