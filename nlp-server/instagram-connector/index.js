"use strict";
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const handlebars = require('handlebars');
const path = require('path');
const fs = require('fs');
const pjson = require('./package.json');
const winston = require('./winston');
const url = require('url');

// tiledesk clients
const { TiledeskChannel } = require('./tiledesk/TiledeskChannel');
const { InstagramClient } = require('./tiledesk/InstagramClient');
const { TiledeskinstagramTranslator } = require('./tiledesk/TiledeskinstagramTranslator');
const { MessageHandler } = require('./tiledesk/MessageHandler');
const { TiledeskSubscriptionClient } = require('./tiledesk/TiledeskSubscriptionClient');

const { KVBaseMongo } = require('./tiledesk/KVBaseMongo');
const kvbase_collection = 'kvstore';
const db = new KVBaseMongo(kvbase_collection);
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static(path.join(__dirname, 'template')))

let API_URL = null;
let BASE_URL = null;
let APPS_API_URL = null;
let INSTA_APP_ID = null;
let INSTA_APP_SECRET = null;
let VERIFY_TOKEN = null;
let GRAPH_URL = null;
let DASHBOARD_BASE_URL = null;
let BRAND_NAME = null;

handlebars.registerHelper('isEqual', (a, b) => {
    if (a == b) {
      return true
    } else {
      return false
    }
  })

router.get('/', async (req, res) => {
    res.send('NLP BAY Instagram Connector!')
  })
router.get('/detail', async (req, res) => {

    let project_id = req.query.project_id;
    let token = req.query.token;
    let app_id = req.query.app_id;
  
    if (!project_id || !token || !app_id) {
      return res.status(400).send({ message: "queryParams project_id, token, app_id are mandatory" });
    }
  
    const tdChannel = new TiledeskChannel({ settings: { project_id: project_id, token: token }, API_URL: API_URL })
    let isAvailable = await tdChannel.getProjectDetail();
    winston.debug("(wab) app is available: " + isAvailable);
  
    const appClient = new TiledeskAppsClient({ APPS_API_URL: APPS_API_URL });
    let installation = await appClient.getInstallations(project_id, app_id);
  
    let installed = false;
    if (installation) {
      installed = true;
    }
  
    readHTMLFile('/detail.html', (err, html) => {
      var template = handlebars.compile(html);
      var replacements = {
        app_version: pjson.version,
        project_id: project_id,
        token: token,
        app_id: app_id,
        installed: installed,
        isAvailable: isAvailable
      }
      var html = template(replacements);
      res.send(html);
    })
  })

router.post('/install', async (req, res) => {

    let project_id = req.body.project_id;
    let app_id = req.body.app_id;
    let token = req.body.token;
  
    winston.verbose("(fbm) Install app " + app_id + " for project id " + project_id);
    let installation_info = {
      project_id: project_id,
      app_id: app_id,
      createdAt: Date.now()
    };
  
    const appClient = new TiledeskAppsClient({ APPS_API_URL: APPS_API_URL });
    appClient.install(installation_info).then((installation) => {
  
      winston.debug("(fbm) installation response: ", installation);
  
      res.redirect(url.format({
        pathname: "/detail",
        query: {
          "project_id": project_id,
          "app_id": app_id,
          "token": token
        }
      }));
  
    }).catch((err) => {
      winston.error("(fbm) installation error: ", err.data)
      winston.error("(fbm) installation error: " + err.data)    
      res.send("An error occurred during the installation");
    })
  
  })
router.post('/uninstall', async (req, res) => {

    winston.verbose("(fbm) /uninstall");
    let project_id = req.body.project_id;
    let app_id = req.body.app_id;
    let token = req.body.token;
  
    const appClient = new TiledeskAppsClient({ APPS_API_URL: APPS_API_URL });
    appClient.uninstall(project_id, app_id).then((response) => {
  
      winston.debug("(fbm) uninstallation response: ", response);
  
      res.redirect(url.format({
        pathname: "/detail",
        query: {
          "project_id": project_id,
          "app_id": app_id,
          "token": token
        }
      }));
  
    }).catch((err) => {
      winston.error("(fbm) uninsallation error: " + err.data)
      winston.error("(fbm) uninsallation error: ", err.data)
      res.send("An error occurred during the uninstallation");
    })
  
  })
router.get("/configure",async(req,res)=>{
    winston.verbose("(fbm) /configure");
    winston.info(req.body);
    let project_id = req.query.project_id;
    let token = req.query.token;
    let app_id = req.query.app_id;
    let CONTENT_KEY=`instagram-${project_id}`;
    let settings=await db.get(CONTENT_KEY);
    const tdChannel = new TiledeskChannel({ settings: { project_id: project_id, token: token }, API_URL: API_URL })
    let departments = await tdChannel.getDepartments(token);
    winston.verbose("(fbm) found " + departments.length + " departments")
    
  if (settings) {
    winston.debug("(fbm) settings found: ", settings);

    readHTMLFile('/configure.html', (err, html) => {
      var template = handlebars.compile(html);
      var replacements = {
        app_version: pjson.version,
        project_id: project_id,
        connected: true,
        token: token,
        app_id: app_id,
        endpoint: BASE_URL,
        pages: settings.pages,
        isEmpty: true,
        department_id: settings.department_id,
        departments: departments,
        brand_name: BRAND_NAME
      }
      var html = template(replacements)
      res.send(html);
    })
} else {
    readHTMLFile('/configure.html', (err, html) => {
        var template = handlebars.compile(html);
        var replacements = {
          app_version: pjson.version,
          project_id: project_id,
          token: token,
          endpoint: BASE_URL,
          departments: departments,
          redirect_uri: `https://www.instagram.com/oauth/authorize?client_id=${INSTA_APP_ID}&redirect_uri=${BASE_URL}/oauth?&scope=instagram_business_basic%2C%20instagram_business_manage_messages&state={"project_id":"${project_id}","app_id":"${app_id}","token":"${token}"}`,
          brand_name: BRAND_NAME
        }
        var html = template(replacements);
        res.send(html);
  
      }) 
}

})

router.get('/oauth', async (req, res) => {
    winston.verbose("(ibm) /oauth")
  
    let project_id = JSON.parse(req.query.state).project_id;
    var code = req.query.code;
    let token = JSON.parse(req.query.state).token;
    let app_id = JSON.parse(req.query.state).app_id;
  
    const tdClient = new TiledeskSubscriptionClient({ API_URL: API_URL, project_id: project_id, token: token })
    const instaClient = new InstagramClient({ GRAPH_URL: GRAPH_URL, INSTA_APP_ID: INSTA_APP_ID, APP_SECRET: INSTA_APP_SECRET, BASE_URL: BASE_URL });
  
    const subscription_info = {
      target: BASE_URL + '/tiledesk',
      event: 'message.create.request.channel.instagram',
    }
  
    const subscription = await tdClient.subscribe(subscription_info);
    const access_token = await instaClient.getAccessTokenFromCode(code);
    const instagramBusinessAccount = await instaClient.getInstagramBusinessAccount(access_token);

    if (!instagramBusinessAccount) {
        return res.status(400).send('No Instagram Business Account linked to this access_token.');
    }

    winston.debug("(ibm) subscription: " + subscription);
    winston.debug("(ibm) access_token: " + access_token);
    winston.debug("(ibm) instagramBusinessAccount: " + instagramBusinessAccount);
  
    let CONTENT_KEY = "instagram-" + project_id;
  
    
    let event_sub = await fbClient.messageEventSubscription(instagramBusinessAccount.id, instagramBusinessAccount.access_token);
    winston.debug("(fbm) event subscription: " + event_sub.status + " " + event_sub.statusText)
  
    let settings = {
      project_id: project_id,
      token: token,
      access_token: access_token,
      subscription_id: subscription._id,
      secret: subscription.secret,
      account: instagramBusinessAccount,
      app_id: app_id
    }
  
    await db.set(CONTENT_KEY, settings);
  
    //let settings_retrived = await db.get(CONTENT_KEY);
    //var redirect_uri = DASHBOARD_BASE_URL + "/#/project/" + project_id + "/app-store-install/" + app_id + "/run";
    var redirect_uri = DASHBOARD_BASE_URL + "/#/project/" + project_id + "/integrations?name=instagram";
    console.log("(fbm) redirect_uri: ", redirect_uri);
    res.redirect(redirect_uri);

  
  })

router.post('/disconnect', async (req, res) => {
    winston.verbose("(fbm) /disconnect");
  
    let project_id = req.body.project_id;
    let token = req.body.token;
    let subscription_id = req.body.subscription_id;
  
    let CONTENT_KEY = "instagram-" + project_id;
  
    let settings = await db.get(CONTENT_KEY);
   
  
    await db.remove(CONTENT_KEY)
    winston.verbose("(fbm) Content deleted.");
  
    const tdClient = new TiledeskSubscriptionClient({ API_URL: API_URL, project_id: project_id, token: token })
    tdClient.unsubscribe(settings.subscription_id).then(async (data) => {
  
      const tdChannel = new TiledeskChannel({ settings: { project_id: project_id, token: token }, API_URL: API_URL })
      let departments = await tdChannel.getDepartments(token);
      winston.debug("(fbm) found " + departments.length + " departments")
  
      readHTMLFile('/configure.html', (err, html) => {
  
        var template = handlebars.compile(html);
        var replacements = {
          app_version: pjson.version,
          project_id: project_id,
          token: token,
          endpoint: BASE_URL,
          departments: departments,
          brand_name: BRAND_NAME,
          redirect_uri: `https://www.instagram.com/oauth/authorize?client_id=${INSTA_APP_ID}&redirect_uri=${BASE_URL}/oauth?&scope=instagram_business_basic%2C%20instagram_business_manage_messages&state={"project_id":"${project_id}","app_id":"${settings.app_id}","token":"${token}"}`,
        }
        var html = template(replacements)
        return res.send(html);
      })
  
    }).catch((err) => {
      winston.error("(fbm) unsubscribe error: ", err);
    })
  
  
  })
router.post('/tiledesk', async (req, res) => {
    winston.verbose("(fbm) Message received from Tiledesk");
    winston.info("(fbm) Message received from Tiledesk body: ", req.body);
  
    let tiledeskChannelMessage = req.body.payload;
    let project_id = req.body.payload.id_project;
  
    // get settings from mongo
    let CONTENT_KEY = "instagram-" + project_id;
    let settings = await db.get(CONTENT_KEY);
  
    var text = req.body.payload.text;
    let sender_id = req.body.payload.sender;
    let attributes = req.body.payload.attributes;
  
    let commands;
    if (attributes && attributes.commands) {
      commands = attributes.commands;
    }
  
    if (sender_id.indexOf("fbm") > -1) {
      winston.debug("(fbm) Skip same sender");
      return res.sendStatus(200);
    }
  
    if (attributes && attributes.subtype === "info") {
      winston.debug("(fbm) Skip subtype (info)");
      return res.sendStatus(200);
    }
    
    if (attributes && attributes.subtype === "private") {
      winston.verbose("(wab) Skip subtype (private)");
      return res.sendStatus(200);
    }
  
    if (attributes && attributes.subtype === 'info/support') {
      winston.debug("(fbm) Skip subtype: " + attributes.subtype);
      return res.sendStatus(200);
    }
  
    let recipient_id = tiledeskChannelMessage.recipient;
    let sender = tiledeskChannelMessage.sender;
    let page_id = recipient_id.substring(recipient_id.lastIndexOf("fbm-") + 4, recipient_id.lastIndexOf("-"));
    let messenger_receiver = recipient_id.substring(recipient_id.lastIndexOf("-") + 1);
  
    winston.info("(fbm) sender: " + sender);
    winston.info("(fbm) text: " + text);
    winston.info("(fbm) attributes: ", attributes);
    winston.info("(fbm) tiledesk sender_id: " + sender_id);
    winston.info("(fbm) recipient_id: " + recipient_id);
    winston.info("(fbm) page_id: " + page_id);
    winston.info("(fbm) messenger_receiver: " + messenger_receiver);
  
    // Return an info message option
    if (settings.expired &&
      settings.expired === true) {
  
      winston.verbose("settings expired: " + settings.expired);
      let tiledeskJsonMessage = {
        text: 'Expired. Upgrade Plan.',
        sender: "system",
        senderFullname: "System",
        attributes: {
          subtype: 'info',
          messagelabel: { key: 'PLAN_EXPIRED'  } // for translation
        },
        channel: { name: 'instagram' }
      }
      let message_info = {
        channel: "instagram",
        messenger: {
          page_id: page_id,
          sender_id: messenger_receiver
        }
      }
  
      const tdChannel = new TiledeskChannel({ settings: settings, API_URL: API_URL })
      const response = await tdChannel.send(tiledeskJsonMessage, message_info, settings.department_id);
      winston.verbose("(wab) Expiration message sent to Tiledesk")
      return res.sendStatus(200);
    }
  
    const page_detail = settings.pages.find(p => p.id === page_id);
    const fbClient = new InstagramClient({ GRAPH_URL: GRAPH_URL, FB_APP_ID: FB_APP_ID, APP_SECRET: APP_SECRET, BASE_URL: BASE_URL });
    const messageHandler = new MessageHandler({ tiledeskChannelMessage: tiledeskChannelMessage });
    const tlr = new TiledeskinstagramTranslator();
  
    if (commands) {
      let i = 0;
      async function execute(command) {
        // message
        if (command.type === "message") {
          let tiledeskCommandMessage = await messageHandler.generateMessageObject(command);
          winston.debug("(fbm) message generated from command: ", tiledeskCommandMessage)
  
  
          let messagesList = await messageHandler.splitMessageFromTiledesk(tiledeskCommandMessage);
  
          let j = 0;
          async function send(message) {
            let messengerJsonMessage = await tlr.toinstagram(message, messenger_receiver)
            winston.verbose("(fbm) messengerJsonMessage" + JSON.stringify(messengerJsonMessage));
  
  
            if (messengerJsonMessage) {
              fbClient.send(messengerJsonMessage, page_detail.access_token).then((response) => {
                winston.debug("(fbm) Message sent to Messenger!" + response.status + response.statusText);
                j += 1;
                if (j < messagesList.length) {
                  send(messagesList[j])
                } else {
                  winston.debug("(fbm) End of splitted message -> go to next command")
                  i += 1;
                  if (i < commands.length) {
                    execute(commands[i]);
                  } else {
                    winston.debug("(fbm) End of commands")
                  }
                }
              })
            } else {
              winston.error("(fbm) messengerJsonMessage is undefined!")
            }
          }
          send(messagesList[0]);
        }
  
        // wait
        if (command.type === "wait") {
          setTimeout(() => {
            i += 1;
            if (i < commands.length) {
              execute(commands[i]);
            } else {
              winston.debug("(fbm) End of commands")
            }
          }, command.time)
        }
      }
      execute(commands[0]);
    }
  
    else if (tiledeskChannelMessage.text || tiledeskChannelMessage.metadata) {
  
      let messagesList = await messageHandler.splitMessageFromTiledesk(tiledeskChannelMessage);
      winston.debug("(fbm) message splitted in " + messagesList.length + " messages");
  
      let j = 0;
      async function send(message) {
        let messengerJsonMessage = await tlr.toinstagram(message, messenger_receiver);
        winston.verbose("(fbm) messengerJsonMessage", messengerJsonMessage)
  
        if (messengerJsonMessage) {
          fbClient.send(messengerJsonMessage, page_detail.access_token).then((response) => {
            winston.verbose("(fbm) Message sent to Messenger!" + response.status + " " + response.statusText);
            j += 1;
            if (j < messagesList.length) {
              send(messagesList[j])
            } else {
              winston.debug("(fbm) End of splitted message")
            }
          }).catch((err) => {
            winston.error("(fbm) error send message: ", err)
          })
        } else {
          winston.error("(fbm) messengerJsonMessage is undefined!")
        }
      }
      send(messagesList[0]);
  
    }
  
    else {
      winston.debug("(fbm) no command, no text --> skip")
    }
  
    return res.status(200).send({ message: "sent" });
  })
  router.post('/webhookFB', async (req, res) => {

    winston.verbose("(fbm) Message received from Facebook Messenger");
  
    let body = req.body;
    if (body.object === 'page') {
  
      let page_id = body.entry[0].id;
      let PAGE_KEY = "messenger-page-" + page_id;
      let info_settings = await db.get(PAGE_KEY);
  
      if (!info_settings) {
        winston.debug("(fbm) Facebook page not enabled --> Skip")
        return res.status(200).send('EVENT_RECEIVED');
      }
  
      let project_id = info_settings.project_id;
      winston.debug("(fbm) project_id: " + project_id);
  
      let CONTENT_KEY = "messenger-" + project_id;
      let settings = await db.get(CONTENT_KEY);
  
      body.entry.forEach(async (entry) => {
  
        let messengerChannelMessage = entry.messaging[0];
        winston.debug("(fbm) webhook_event: ", messengerChannelMessage);
  
        const tlr = new TiledeskinstagramTranslator();
        const tdChannel = new TiledeskChannel({ settings: settings, API_URL: API_URL })
        const fbClient = new FacebookClient({ GRAPH_URL: GRAPH_URL, FB_APP_ID: FB_APP_ID, APP_SECRET: APP_SECRET, BASE_URL: BASE_URL });
  
        const page = settings.pages.find(p => p.id === page_id);
  
        let user_info = await fbClient.getUserInfo(page.access_token, messengerChannelMessage.sender.id)
        messengerChannelMessage.sender.fullname = user_info.first_name + " " + user_info.last_name;
  
        winston.debug("(fbm) page: " + page);
        winston.debug("(fbm) user_info: ", user_info);
  
        let message_info = {
          channel: TiledeskinstagramTranslator.CHANNEL_NAME,
          messenger: {
            page_id: page_id,
            sender_id: messengerChannelMessage.sender.id,
            firstname: user_info.first_name,
            lastname: user_info.last_name
          }
        }
  
        if (messengerChannelMessage.message &&
          messengerChannelMessage.message.attachments &&
          messengerChannelMessage.message.attachments.length > 1) {
  
          const messageHandler = new MessageHandler();
          let messagesList = await messageHandler.splitMessageFromMessenger(messengerChannelMessage);
  
          for (let message of messagesList) {
  
            let tiledeskJsonMessage = await tlr.toTiledesk(message);
            winston.verbose("(fbm) tiledeskJsonMessage: ", tiledeskJsonMessage);
  
            if (tiledeskJsonMessage) {
              const response = await tdChannel.send(tiledeskJsonMessage, message_info, settings.department_id);
              winston.verbose("(fbm) Message sent to Tiledsk")
              winston.debug("(fbm) response: ", response);
            } else {
              winston.verbose("(fbm) tiledeskJsonMessage is undefined!")
            }
  
          }
  
        } else {
          let tiledeskJsonMessage = await tlr.toTiledesk(messengerChannelMessage);
          winston.verbose("(fbm) tiledeskJsonMessage: ", tiledeskJsonMessage);
  
          if (tiledeskJsonMessage) {
            const response = await tdChannel.send(tiledeskJsonMessage, message_info, settings.department_id);
            winston.verbose("(fbm) Message sent to Tiledsk")
            winston.debug("(fbm) response: ", response)
          } else {
            winston.verbose("(fbm) tiledeskJsonMessage is undefined!")
          }
        }
  
      })
    }
  
    return res.status(200).send('EVENT_RECEIVED');
  })
  
  router.get('/webhookFB', async (req, res) => {
  
    winston.verbose("(fbm) Verify the webhook... ", req.query);
  
    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
  
    winston.verbose("(fbm) token: " + token);
    winston.verbose("(fbm) verify token: " + VERIFY_TOKEN);
    winston.verbose("(fbm) mode: " + mode)
    winston.verbose("(fbm) challenge: " + challenge)
  
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
  
      // Checks the mode and token sent is correct
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
  
        // Responds with the challenge token from the request
        winston.verbose('(fbm) Webhook verified');
        return res.status(200).send(challenge);
  
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        return res.sendStatus(403);
      }
    }
    return res.sendStatus(403);
  })
function startApp(settings, callback) {
    winston.info("(fbm) Starting Instagram App");
  
    if (!settings.MONGODB_URL) {
      winston.error("(fbm) MONGODB_URL is mandatory. Exit...");
      return callback('Missing parameter: MONGODB_URL');
    }
  
    if (!settings.API_URL) {
      winston.error("(fbm) API_URL is mandatory. Exit...");
      return callback('Missing parameter: API_URL');
    } else {
      API_URL = settings.API_URL;
      winston.info("(fbm) API_URL: " + API_URL);
    }
  
    if (!settings.BASE_URL) {
      winston.error("(fbm) BASE_URL is mandatory. Exit...");
      return callback('Missing parameter: BASE_URL')
    } else {
      BASE_URL = settings.BASE_URL;
      winston.info("(fbm) BASE_URL: " + BASE_URL);
    }
  
    if (!settings.DASHBOARD_BASE_URL) {
      winston.error("(fbm) DASHBOARD_BASE_URL is mandatory. Exit...");
      return callback('Missing parameter: DASHBOARD_BASE_URL');
    } else {
      DASHBOARD_BASE_URL = settings.DASHBOARD_BASE_URL;
      winston.info("(fbm) DASHBOARD_BASE_URL: " + DASHBOARD_BASE_URL)
    }
  
    if (!settings.APPS_API_URL) {
      winston.error("(fbm) APPS_API_URL is mandatory. Exit...");
      return callback('Missing parameter: APPS_API_URL');
    } else {
      APPS_API_URL = settings.APPS_API_URL;
      winston.info("(fbm) APPS_API_URL: " + APPS_API_URL);
    }
  
    if (!settings.INSTA_APP_ID) {
      winston.error("(fbm) INSTA_APP_ID is mandatory. Exit...");
      return callback('Missing parameter: INSTA_APP_ID');
    } else {
      INSTA_APP_ID = settings.INSTA_APP_ID;
      winston.info("(fbm) INSTA_APP_ID: " + INSTA_APP_ID);
    }
  
    if (!settings.INSTA_APP_SECRET) {
      winston.error("(fbm) APP_SECRET is mandatory. Exit...");
      return callback('Missing parameter: APP_SECRET');
    } else {
      INSTA_APP_SECRET = settings.INSTA_APP_SECRET;
      winston.info("(fbm) APP_SECRET: " + APP_SECRET.substring(0, 8) + "************");
    }
  
    if (!settings.VERIFY_TOKEN) {
      winston.error("(fbm) VERIFY_TOKEN is mandatory. Exit...");
      return callback('Missing parameter: VERIFY_TOKEN');
    } else {
      VERIFY_TOKEN = settings.VERIFY_TOKEN;
      winston.info("(fbm) VERIFY_TOKEN: " + VERIFY_TOKEN.substring(0, 8) + "************");
    }
  
    if (!settings.INSTA_GRAPH_URL) {
      winston.error("(fbm) GRAPH_URL is mandatory. Exit...");
      return callback('Missing parameter: GRAPH_URL');
    } else {
      GRAPH_URL = settings.INSTA_GRAPH_URL;
      winston.info("(fbm) GRAPH_URL: " + INSTA_GRAPH_URL);
    }
    
    if (settings.BRAND_NAME) {
      BRAND_NAME = settings.BRAND_NAME
    }
  
    if (settings.dbconnection) {
      db.reuseConnection(settings.dbconnection, () => {
        winston.info("(wab) KVBaseMongo reused exsisting db connection");
        if (callback) {
          callback(null);
        }
      })
    } else {
      db.connect(settings.MONGODB_URL, () => {
        winston.info("(wab) KVBaseMongo successfully connected.");
    
        if (callback) {
          callback(null);
        }
      });
    }
  
  }
  
  function readHTMLFile(templateName, callback) {
    fs.readFile(__dirname + '/template' + templateName, { encoding: 'utf-8' },
      function(err, html) {
        if (err) {
          throw err;
          //callback(err);
        } else {
          callback(null, html)
        }
      })
  }
  
  module.exports = { router: router, startApp: startApp };