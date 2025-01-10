const axios = require("axios").default;
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');
const winston = require('../winston')

class TiledeskInstagram {

  /**
   * Constructor for TiledeskInstagram
   *
   * @example
   * const { TiledeskInstagram } = require('tiledesk-Instagram');
   * const twclient = new TiledeskInstagramClient({ token: InstagramBusinessToken });
   * 
   * @param {Object} config JSON configuration.
   * @param {string} config.token Mandatory. Token required for authentication.
   * @param {string} config.GRAPH_URL Mandatory. Url for facebook Instagram api.
   * @param {boolean} options.log Optional. If true HTTP requests are logged.
   */

  constructor(config) {
    if (!config) {
      throw new Error('config is mandatory');
    }

    if (!config.token) {
      throw new Error('config.token is mandatory');
    }

    if (!config.GRAPH_URL) {
      throw new Error('config.GRAPH_URL is mandatory');
    }
    
    if (!config.API_URL) {
      throw new Error('config.API_URL is mandatory');
    }

    if (!config.BASE_FILE_URL) {
      throw new Error('config.BASE_FILE_URL is mandatory')
    }

    // this.media = config.channelMedia;
    this.token = config.token;
    this.GRAPH_URL = config.GRAPH_URL
    this.api_url = config.API_URL;
    this.base_file_url = config.BASE_FILE_URL;

    this.log = false;
    if (config.log) {
      this.log = config.log;
    }
  }

  async sendMessage(phone_number_id, message) {
    
    winston.debug("(wab) [TiledeskInstagram] Sending message...");

    return await axios({
      url: this.GRAPH_URL + phone_number_id + "/messages?access_token=" + this.token,
      headers: {
        "Content-Type": "application/json",
      },
      data: message,
      method: "POST"
    }).then((response) => {
      winston.debug("(wab) [TiledeskInstagram] Message sent!");
      return response
    }).catch((err) => {
      winston.error("(wab) [TiledeskInstagram] Send message error: ", err.response.data);
      throw err;
    })
  }

  async downloadMedia(mediaId) {
    
    return await axios({
      url: this.GRAPH_URL + mediaId,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.token
      }
    }).then(async (response) => {

      let download_url = response.data.url;
      let mime_type = response.data.mime_type;
      let extension = mime_type.substring(mime_type.lastIndexOf("/") + 1);
      if (extension === 'ogg') {
        extension = 'mp3'
      }
      let tid = this.getId();
      let type = "media-" + tid + "." + extension;

      let example_path = path.join(__dirname, '..', 'tmp', type);
      const writeStream = fs.createWriteStream(example_path);
      winston.debug("(wab) [TiledeskInstagram] Downloading file..." + example_path);

      return await axios({
        url: download_url,
        method: 'GET',
        headers: {
          'Authorization': "Bearer " + this.token
        },
        responseType: 'stream'
      }).then((response) => {

        return new Promise((resolve, reject) => {
          response.data.pipe(writeStream);
          let error = null;
          writeStream.on('error', err => {
            error = err;
            writeStream.close();
            winston.debug("(wab) [TiledeskInstagram] Download failed")
            reject(err);
          });
          writeStream.on('close', () => {
            if (!error) {
              winston.debug("(wab) [TiledeskInstagram] Download completed")
              resolve(type);
            }
          })
        })
      }).catch((err) => {
        winston.error("(wab) [TiledeskInstagram] download file error: ", err.data);
      })
    }).catch((err) => {
      winston.error("(wab) [TiledeskInstagram] get file error: ", err.data);
    })
  }

  async uploadMedia(path, type) {
    let url = this.base_file_url + "/" + type + "/public/";
    winston.debug("(wab) [TiledeskInstagram] Uploading file...");

    const form = new FormData();
    form.append('file', fs.createReadStream(path));
    const request_config = {
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      header: {
        ...form.getHeaders()
      }
    }

    return await axios.post(url, form, request_config).then((response) => {
        
      winston.debug("(wab) [TiledeskInstagram] upload response: ", response.data);
      if (type == "images") {
        //let image_url = "https://tiledesk-server-pre.herokuapp.com/images/?path=" + response.data.filename;
        let image_url = this.base_file_url + "/images/?path=" + response.data.filename;
        return image_url;
      } else {
        //let file_url = "https://tiledesk-server-pre.herokuapp.com/files/download?path=" + response.data.filename;
        let file_url = this.base_file_url + "/files/download?path=" + response.data.filename;
        return file_url;
      }

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
          callback(TiledeskClient.getErr({ message: "Response status not 200" }, options, res), null, null);
        }
      }
    }).catch((err) => {
      winston.error("(wab) [TiledeskInstagram] An error occured: ", err);
      if (callback) {
        callback(err, null, null);
      }
    })
  }


  // FUNCTIONS

  getId() {
    var newTime = Math.floor((new Date()).getTime() / 1000) - 1546300800;//seconds since 01/01/2019
    return newTime.toString(36);
  }

}

module.exports = { TiledeskInstagram };