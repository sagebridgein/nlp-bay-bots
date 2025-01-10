const { v4: uuidv4 } = require('uuid');
const winston = require('../winston')

class TiledeskInstagramTranslator {

  /**
   * Constructor for TiledeskInstagramTranslator
   *const axios = require("axios").default;
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');
   * @example
   * const { TiledeskInstagramTranslator } = require('tiledesk-Instagram-translator');
   * const tlr = new TiledeskInstagramTranslator();
   * 
   * @param {Object} config JSON configuration.
   */

  static Instagram_MESSAGING_PRODUCT = "Instagram";
  static CHANNEL_NAME = "Instagram";

  constructor() {

    /*
    if (!config.tiledeskChannelMessage) {
      throw new Error('config.tiledeskChannelMessage is mandatory');
    }
    this.tiledeskChannelMessage = config.tiledeskChannelMessage;
    */

    this.log = false;
  }
  

  /*
  *************** START ***************
  ********* Instagram BUSINESS *********
  *************************************
  */

  /** Returns a Instagram  messagem new request ID for the specified Project.<br>
   * A request's ID has the format:<br>
   * <br>
   * <i>support-group-PROJECT_ID-UNIQUE_ID</i><br>
   * <br>
   * <i>UNIQUE_ID</i> MUST be unique in your Project. <b>This method always returns an <i>UUID</i> for the <i>UNIQUE_ID</i> component</b>.
   * 
   * @param {Object} tiledeskChannelMessage - The message in Tiledesk format.
   * @param {string} Instagram_receiver - The Instagram recipient fo the message.
  */
  toInstagram(tiledeskChannelMessage, Instagram_receiver) {

    winston.debug("(wab) [Translator] tiledesk message: ", tiledeskChannelMessage);

    let text = '';
    if (tiledeskChannelMessage.text) {
      text = tiledeskChannelMessage.text;
    }

    let Instagram_message = {
      messaging_product: TiledeskInstagramTranslator.Instagram_MESSAGING_PRODUCT,
      to: Instagram_receiver,
    }

    if (tiledeskChannelMessage.type === 'frame') {
      text = text + "\n\n👉 " + tiledeskChannelMessage.metadata.src
      Instagram_message.text = { body: text };
      return Instagram_message
    }

    else if (tiledeskChannelMessage.metadata) {

      if ((tiledeskChannelMessage.metadata.type && tiledeskChannelMessage.metadata.type.startsWith('image')) || tiledeskChannelMessage.type.startsWith('image')) {
        var imgUrl = tiledeskChannelMessage.metadata.src;
        Instagram_message.type = 'image'
        Instagram_message.image = {
          link: imgUrl,
          caption: text
        }
      }

      else if ((tiledeskChannelMessage.metadata.type && tiledeskChannelMessage.metadata.type.startsWith('video')) || tiledeskChannelMessage.type.startsWith('video')) {
        var videoUrl = tiledeskChannelMessage.metadata.src;
        Instagram_message.type = 'video'
        Instagram_message.video = {
          link: videoUrl,
          caption: tiledeskChannelMessage.metadata.name || tiledeskChannelMessage.text
        }
      }

      else if (tiledeskChannelMessage.metadata.type.startsWith('application')) {
        //var doc = tiledeskChannelMessage.metadata.src;
        var doc = tiledeskChannelMessage.metadata.downloadURL;
        Instagram_message.type = 'document'
        Instagram_message.document = {
          link: doc,
          filename: tiledeskChannelMessage.metadata.name,
        }
        
        let index = tiledeskChannelMessage.text.indexOf(tiledeskChannelMessage.metadata.src);
        if (index != -1) {
          let length = tiledeskChannelMessage.metadata.src.length;
          let caption = tiledeskChannelMessage.text.substring(index + length + 2);
          Instagram_message.document.caption = caption;
        }
        
      }

      else {
        winston.verbose("(wab) [Translator] file type not supported")
        return null
      }

      return Instagram_message;

    } else if (tiledeskChannelMessage.attributes) {
      if (tiledeskChannelMessage.attributes.attachment) {
        if (tiledeskChannelMessage.attributes.attachment.buttons) {

          let buttons = tiledeskChannelMessage.attributes.attachment.buttons;

          let quick_replies = [];
          let option_rows = [];
          let action_rows = [];

          let buttons_count = 0;
          for (let btn of buttons) {
            if (btn.type != 'url') {
              buttons_count = buttons_count + 1;
            }
          }

          if (buttons_count == 0) {

            for (let btn of buttons) {
              if (btn.type == 'url') {
                text = text + "\n\n👉 " + btn.value + " (" + btn.link + ")"
              }
            }

            Instagram_message.text = { body: text };
            return Instagram_message;
          }

          if (buttons_count > 0 && buttons_count < 4) {

            for (let btn of buttons) {
              let title = (btn.value.length > 20) ? btn.value.substr(0, 18) + '..' : btn.value;

              if (btn.type == 'text') {
                let text_btn = {
                  type: "reply",
                  reply: {
                    id: "quick" + uuidv4().substring(0, 4) + "_" + btn.value,
                    title: title
                  }
                }
                quick_replies.push(text_btn);
              }

              if (btn.type == 'action') {
                let action_btn = {
                  type: "reply",
                  reply: {
                    id: "action" + uuidv4().substring(0, 4) + "_" + btn.action,
                    title: title
                  }
                }
                quick_replies.push(action_btn);
              }

              if (btn.type == 'url') {
                text = text + "\n\n👉 " + btn.value + " (" + btn.link + ")";
              }
            }

            Instagram_message.type = "interactive";
            Instagram_message.interactive = {
              type: "button",
              body: { text: text },
              action: { buttons: quick_replies }
            };
            return Instagram_message;
          }

          if (buttons_count > 3 && buttons_count < 11) {

            for (let btn of buttons) {
              let title = (btn.value.length > 24) ? btn.value.substr(0, 22) + '..' : btn.value;

              if (btn.type == 'text') {
                let row = {
                  id: "quick" + uuidv4().substring(0, 4) + "_" + btn.value,
                  title: title
                }
                //option_rows.push(row);
                action_rows.push(row);
              }

              if (btn.type == 'action') {
                let row = {
                  id: "action" + uuidv4().substring(0, 4) + "_" + btn.action,
                  title: title
                }
                action_rows.push(row);
              }

              if (btn.type == 'url') {
                text = text + "\n\n👉 " + btn.value + " (" + btn.link + ")"
              }

            }

            Instagram_message.type = "interactive";
            let sections;

            if (option_rows.length > 0 && action_rows.length > 0) {
              sections = [
                {
                  title: "Options",
                  rows: option_rows
                },
                {
                  title: "Actions",
                  rows: action_rows
                }
              ]
            }

            if (option_rows.length > 0 && action_rows.length == 0) {
              sections = [
                {
                  title: "Options",
                  rows: option_rows
                }
              ]
            }

            // only available at the moment --> all buttons are now "actions"
            if (option_rows.length == 0 && action_rows.length > 0) {
              sections = [
                {
                  //title: "Menu",
                  rows: action_rows
                }
              ]
            }

            Instagram_message.interactive = {
              type: "list",
              body: { text: text },
              action: {
                button: "Choose an option",
                sections: sections
              }
            }
            return Instagram_message;
          }

          if (buttons_count > 10) {
            // too many buttons
            // Option 1: Skip message
            // Option 2: Cut buttons array -> display first 10 buttons only
            // Option 3: Send message with *buttons (questa)

            Instagram_message.text = { body: tiledeskChannelMessage.attributes._raw_message };
            return Instagram_message;
          }

        }
        else if (tiledeskChannelMessage.attributes.attachment.template) {
          winston.debug("(wab) [Translator] template: ", tiledeskChannelMessage.attributes.attachment.template)

          let template = tiledeskChannelMessage.attributes.attachment.template;

          Instagram_message.type = "template";
          Instagram_message.template = {
            name: template.name,
            language: {
              code: template.language
            }
          }
          let components = [];
          if (template.params && template.params.header) {
            let component = {
              type: "header",
              parameters: template.params.header
            }
            components.push(component);
          }
          if (template.params && template.params.body) {
            let component = {
              type: "body",
              parameters: template.params.body
            }
            components.push(component);
          }
          if (template.params && template.params.buttons) {

            let component = {
              type: "button",
              sub_type: "url",
              index: "0",
              parameters: template.params.buttons
            }
            components.push(component);

            /*
            template.params.buttons.forEach((button) => {
              let component = button;
              components.push(component);
            })
            
            let component = {
              type: "button",
              sub_type: "url",
              parmeters: template.params.buttons
            }
            */
          }

          if (components.length > 0) {
            Instagram_message.template.components = components;
          }

          return Instagram_message;

        }
        else {

          Instagram_message.text = { body: text };
          return Instagram_message;
        }

      } else {

        Instagram_message.text = { body: text };
        return Instagram_message;
      }

    }
    else {
      // standard message
      Instagram_message.text = { body: text };
      return Instagram_message;
    }
  }

  async createTemplateMessage(template, receiver, params) {

    let Instagram_message = {
      messaging_product: TiledeskInstagramTranslator.Instagram_MESSAGING_PRODUCT,
      to: receiver.phone_number,
      type: "template"
    }

    Instagram_message.template = {
      name: template.name,
      language: {
        code: template.language
      }
    }

    /*
    let params_filled = await this.fillParams(params, receiver);

    let components = [];
    if (params_filled && params_filled.header) {
      let component = {
        type: "header",
        parameters: params_filled.header
      }
      components.push(component);
    }
    if (params_filled && params_filled.body) {
      let component = {
        type: "body",
        parameters: params_filled.body
      }
      components.push(component);
    }
    if (params_filled && params_filled.buttons) {

      let component = {
        type: "button",
        sub_type: "url",
        index: "0",
        parameters: params_filled.buttons
      }
      components.push(component);
    }
    */

    let components = [];

    
    if (receiver.header_params) {
      let component = {
        type: "header",
        parameters: receiver.header_params
      }
      components.push(component);
    }
    
    if (receiver.body_params) {
      let component = {
        type: "body",
        parameters: receiver.body_params
      }
      components.push(component);
    }

    if (receiver.buttons_params) {

      let component = {
        type: "button",
        sub_type: "url",
        index: "0",
        parameters: receiver.buttons_params
      }
      components.push(component);
    }

    if (receiver.url_buttons_params) {

      let component = {
        type: "button",
        sub_type: "url",
        index: "0",
        parameters: receiver.url_buttons_params
      }
      components.push(component);
    }

    if (components.length > 0) {
      Instagram_message.template.components = components;
    }


    return Instagram_message;
  }

  async toTiledesk(InstagramChannelMessage, from, media_url) {

    winston.debug("(wab) [Translator] Instagram message: ", InstagramChannelMessage);

    // text message
    if (InstagramChannelMessage.type == 'text') {
      var data = {
        text: InstagramChannelMessage.text.body,
        senderFullname: from,
        channel: { name: TiledeskInstagramTranslator.CHANNEL_NAME }
      }
      return data;
    }

    else if (InstagramChannelMessage.type == 'button')  {
      var tiledeskMessage = {
        text: InstagramChannelMessage.button.text, // or InstagramChannelMessage.button.payload (?)
        senderFullname: from,
        channel: { name: TiledeskInstagramTranslator.CHANNEL_NAME }
      }
      return tiledeskMessage;
    }

    // interactive message
    else if (InstagramChannelMessage.type == 'interactive') {
      
      // list reply
      if (InstagramChannelMessage.interactive.type == 'list_reply') {
        // action button
        if (InstagramChannelMessage.interactive.list_reply.id.startsWith("action")) {
          var tiledeskMessage = {
            senderFullname: from,
            //text: ' ',
            text: InstagramChannelMessage.interactive.list_reply.title,
            type: 'text',
            attributes: {
              action: InstagramChannelMessage.interactive.list_reply.id.substring(11),
              //subtype: 'info'
            },
            channel: { name: TiledeskInstagramTranslator.CHANNEL_NAME }
          }
          return tiledeskMessage;
        }
        // quick reply button
        if (InstagramChannelMessage.interactive.list_reply.id.startsWith("quick")) {
          var tiledeskMessage = {
            text: InstagramChannelMessage.interactive.list_reply.title,
            senderFullname: from,
            channel: { name: TiledeskInstagramTranslator.CHANNEL_NAME }
          }
          return tiledeskMessage;
        }
      }

      // inline button reply
      if (InstagramChannelMessage.interactive.type == 'button_reply') {
        // action button
        if (InstagramChannelMessage.interactive.button_reply.id.startsWith("action")) {
          var tiledeskMessage = {
            senderFullname: from,
            //text: ' ',
            text: InstagramChannelMessage.interactive.button_reply.title,
            type: 'text',
            attributes: {
              action: InstagramChannelMessage.interactive.button_reply.id.substring(11),
              //subtype: 'info'
            },
            channel: { name: TiledeskInstagramTranslator.CHANNEL_NAME }
          }
          return tiledeskMessage;
        }
        // quick reply button
        if (InstagramChannelMessage.interactive.button_reply.id.startsWith("quick")) {
          var tiledeskMessage = {
            //text: InstagramChannelMessage.interactive.button_reply.id.substring(10),
            text: InstagramChannelMessage.interactive.button_reply.title,
            senderFullname: from,
            channel: { name: TiledeskInstagramTranslator.CHANNEL_NAME }
          }
          return tiledeskMessage;
        }
      }
    }

    // media message - image
    else if (InstagramChannelMessage.type == 'image') {

      let text = "Image attached"
      if (InstagramChannelMessage.image.caption) {
        text = InstagramChannelMessage.image.caption;
      }

      var tiledeskMessage = {
        text: text,
        senderFullname: from,
        channel: { name: TiledeskInstagramTranslator.CHANNEL_NAME },
        type: "image",
        metadata: {
          src: media_url
        }
      }
      return tiledeskMessage;
    }

    // media message - video
    else if (InstagramChannelMessage.type == 'video') {

      let text = "Video attached"
      if (InstagramChannelMessage.video.caption) {
        text = InstagramChannelMessage.video.caption;
      }

      var tiledeskMessage = {
        text: "[Download video](" + media_url + ")",
        senderFullname: from,
        channel: { name: TiledeskInstagramTranslator.CHANNEL_NAME },
        type: "file",
        metadata: {
          name: "video.mp4",
          type: "video/mp4",
          src: media_url,
        }
      }
      return tiledeskMessage;
    }

    // media message - document
    else if (InstagramChannelMessage.type == 'document') {

      let text = "Document attached"
      if (InstagramChannelMessage.document.caption) {
        text = InstagramChannelMessage.document.caption
      }

      var tiledeskMessage = {
        text: "[Dowload document](" + media_url + ")",
        senderFullname: from,
        channel: { name: TiledeskInstagramTranslator.CHANNEL_NAME },
        type: "file",
        metadata: {
          name: "document.pdf",
          type: "application/pdf",
          src: media_url
        }
      }
      return tiledeskMessage;
    }

    // media message - audio
    else if (InstagramChannelMessage.type == 'audio') {

      let text = "Audio attached"
      /*if (InstagramChannelMessage.document.caption) {
        text = InstagramChannelMessage.document.caption
      }*/

      var tiledeskMessage = {
        text: "",
        senderFullname: from,
        channel: { name: TiledeskInstagramTranslator.CHANNEL_NAME },
        type: "file",
        metadata: {
          name: "audio.mp3",
          type: "audio/mpeg",
          src: media_url
        }
      }
      return tiledeskMessage;
    }

    else {
      winston.verbose("(wab) [Translator] unsupported Instagram messsage type");
      return null;
    }
  }

  async fillParams(params, rcv_option) {
    winston.verbose("(wab) [Translator] fillParams...");

    if (!params) {
      return null;
    }

    let header_params = params.header;
    if (header_params) {
      header_params.forEach((param, i) => {
        if (param.type === "text") {
          param.text = rcv_option.header_params[i];
        }
        if (param.type === "IMAGE") {
          param.image = {
            link: rcv_option.header_params[i]
          }
        }
        if (param.type === 'DOCUMENT') {
          param.document = {
            link: rcv_option.header_params[i]
          }
        }
        if (param.type === 'LOCATION') {
          // Check how to send location template!
        }
      })
    }

    let body_params = params.body;
    if (body_params) {
      body_params.forEach((param, i) => {
        param.text = rcv_option.body_params[i];
      })
    }

    let buttons_params = params.buttons;
    if (buttons_params) {
      buttons_params.forEach((param, i) => {
        param.text = rcv_option.buttons_params[i];
      })
    }
    return params;
  }


  async sanitizeTiledeskMessage(tiledeskJsonMessage, rcv_option) {
    winston.verbose("(wab) [Translator] Sanitizing...");

    if (!tiledeskJsonMessage.attributes.attachment.template.params) {
      return tiledeskJsonMessage;
    }

    let header_params = tiledeskJsonMessage.attributes.attachment.template.params.header;
    if (header_params) {
      header_params.forEach((param, i) => {
        if (param.type === "text") {
          param.text = rcv_option.header_params[i];
        }
        if (param.type === "IMAGE") {
          param.image = {
            link: rcv_option.header_params[i]
          }
        }
        if (param.type === 'DOCUMENT') {
          param.document = {
            link: rcv_option.header_params[i]
          }
        }
        if (param.type === 'LOCATION') {
          // Check how to send location template!
        }
      })
    }

    let body_params = tiledeskJsonMessage.attributes.attachment.template.params.body;
    if (body_params) {
      body_params.forEach((param, i) => {
        param.text = rcv_option.body_params[i];
      })
    }

    let buttons_params = tiledeskJsonMessage.attributes.attachment.template.params.buttons;
    if (buttons_params) {
      buttons_params.forEach((param, i) => {
        param.text = rcv_option.buttons_params[i];
      })
    }

    return tiledeskJsonMessage;
  }
  /*
  *************************************
  ********* Instagram BUSINESS *********
  **************** END ****************
  */

}

module.exports = { TiledeskInstagramTranslator };