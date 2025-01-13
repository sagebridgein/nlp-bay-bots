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
const { TiledeskAppsClient } = require('./tiledesk/TiledeskAppsClient');
const { TiledeskChannel } = require('./tiledesk/TiledeskChannel');
const { TiledeskInstagramTranslator } = require('./tiledesk/TiledeskInstagramTranslator');
const { TiledeskSubscriptionClient } = require('./tiledesk/TiledeskSubscriptionClient');
const { InstagramClient } = require('./tiledesk/InstagramClient');
const { MessageHandler } = require('./tiledesk/MessageHandler');


// mongo
const { KVBaseMongo } = require('./tiledesk/KVBaseMongo');
const kvbase_collection = 'kvstore';
const db = new KVBaseMongo(kvbase_collection);

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static(path.join(__dirname, 'template')))

let API_URL = null;
let BASE_URL = null;
let APPS_API_URL = null;
let FB_APP_ID = null;
let APP_SECRET = null;
let VERIFY_TOKEN = null;
let GRAPH_URL = null;
let DASHBOARD_BASE_URL = null;
let BRAND_NAME = null;
// Handlebars register helpers
handlebars.registerHelper('isEqual', (a, b) => {
  if (a == b) {
    return true
  } else {
    return false
  }
})

router.get('/', async (req, res) => {
  res.send('Home works!')
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

  winston.verbose("(ibm) Install app " + app_id + " for project id " + project_id);
  let installation_info = {
    project_id: project_id,
    app_id: app_id,
    createdAt: Date.now()
  };

  const appClient = new TiledeskAppsClient({ APPS_API_URL: APPS_API_URL });
  appClient.install(installation_info).then((installation) => {

    winston.debug("(ibm) installation response: ", installation);

    res.redirect(url.format({
      pathname: "/detail",
      query: {
        "project_id": project_id,
        "app_id": app_id,
        "token": token
      }
    }));

  }).catch((err) => {
    winston.error("(ibm) installation error: ", err.data)
    winston.error("(ibm) installation error: " + err.data)    
    res.send("An error occurred during the installation");
  })

})

router.post('/uninstall', async (req, res) => {

  winston.verbose("(ibm) /uninstall");
  let project_id = req.body.project_id;
  let app_id = req.body.app_id;
  let token = req.body.token;

  const appClient = new TiledeskAppsClient({ APPS_API_URL: APPS_API_URL });
  appClient.uninstall(project_id, app_id).then((response) => {

    winston.debug("(ibm) uninstallation response: ", response);

    res.redirect(url.format({
      pathname: "/detail",
      query: {
        "project_id": project_id,
        "app_id": app_id,
        "token": token
      }
    }));

  }).catch((err) => {
    winston.error("(ibm) uninsallation error: " + err.data)
    winston.error("(ibm) uninsallation error: ", err.data)
    res.send("An error occurred during the uninstallation");
  })

})

router.get('/configure', async (req, res) => {
  winston.verbose("(ibm) /configure");

  let project_id = req.query.project_id;
  let token = req.query.token;
  let app_id = req.query.app_id;

  let CONTENT_KEY = "instagram-" + project_id;

  let settings = await db.get(CONTENT_KEY);

  // get departments
  const tdChannel = new TiledeskChannel({ settings: { project_id: project_id, token: token }, API_URL: API_URL })
  let departments = await tdChannel.getDepartments(token);
  winston.verbose("(ibm) found " + departments.length + " departments")

  if (settings) {
    winston.debug("(ibm) settings found: ", settings);

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
        redirect_uri: `https://www.instagram.com/oauth/authorize?client_id=${FB_APP_ID}&redirect_uri=${BASE_URL}/oauth?&scope=instagram_business_basic%2C%20instagram_business_manage_messages&state={"project_id":"${project_id}","app_id":"${app_id}","token":"${token}"}`,
        brand_name: BRAND_NAME
      }
      var html = template(replacements);
      res.send(html);

    })
  }

})

router.post('/update', async (req, res) => {
  winston.verbose("(ibm) /update");

  let project_id = req.body.project_id;
  let token = req.body.token;
  let app_id = req.body.app_id;
  let department_id = req.body.department;

  let CONTENT_KEY = "instagram-" + project_id;
  let settings = await db.get(CONTENT_KEY);

  settings.department_id = department_id;
  await db.set(CONTENT_KEY, settings);

  // get departments
  const tdChannel = new TiledeskChannel({ settings: { project_id: project_id, token: token }, API_URL: API_URL });
  let departments = await tdChannel.getDepartments(token);
  winston.verbose("(ibm) found " + departments.length + " departments")

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

})

router.post('/tiledesk', async (req, res) => {
  winston.verbose("(ibm) Message received from Tiledesk");
  winston.info("(ibm) Message received from Tiledesk body: ", req.body);

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

  if (sender_id.indexOf("ibm") > -1) {
    winston.debug("(ibm) Skip same sender");
    return res.sendStatus(200);
  }

  if (attributes && attributes.subtype === "info") {
    winston.debug("(ibm) Skip subtype (info)");
    return res.sendStatus(200);
  }
  
  if (attributes && attributes.subtype === "private") {
    winston.verbose("(wab) Skip subtype (private)");
    return res.sendStatus(200);
  }

  if (attributes && attributes.subtype === 'info/support') {
    winston.debug("(ibm) Skip subtype: " + attributes.subtype);
    return res.sendStatus(200);
  }

  let recipient_id = tiledeskChannelMessage.recipient;
  let sender = tiledeskChannelMessage.sender;
  // let page_id = recipient_id.substring(recipient_id.lastIndexOf("ibm-") + 4, recipient_id.lastIndexOf("-"));
  let messenger_receiver = recipient_id.substring(recipient_id.lastIndexOf("-") + 1);

  winston.info("(ibm) sender: " + sender);
  winston.info("(ibm) text: " + text);
  winston.info("(ibm) attributes: ", attributes);
  winston.info("(ibm) tiledesk sender_id: " + sender_id);
  winston.info("(ibm) recipient_id: " + recipient_id);
  winston.info("(ibm) page_id: " + page_id);
  winston.info("(ibm) messenger_receiver: " + messenger_receiver);

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
        // page_id: page_id,
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
  const tlr = new TiledeskInstagramTranslator();

  if (commands) {
    let i = 0;
    async function execute(command) {
      // message
      if (command.type === "message") {
        let tiledeskCommandMessage = await messageHandler.generateMessageObject(command);
        winston.debug("(ibm) message generated from command: ", tiledeskCommandMessage)


        let messagesList = await messageHandler.splitMessageFromTiledesk(tiledeskCommandMessage);

        let j = 0;
        async function send(message) {
          let messengerJsonMessage = await tlr.toinstagram(message, messenger_receiver)
          winston.verbose("(ibm) messengerJsonMessage" + JSON.stringify(messengerJsonMessage));


          if (messengerJsonMessage) {
            fbClient.send(messengerJsonMessage, page_detail.access_token).then((response) => {
              winston.debug("(ibm) Message sent to Messenger!" + response.status + response.statusText);
              j += 1;
              if (j < messagesList.length) {
                send(messagesList[j])
              } else {
                winston.debug("(ibm) End of splitted message -> go to next command")
                i += 1;
                if (i < commands.length) {
                  execute(commands[i]);
                } else {
                  winston.debug("(ibm) End of commands")
                }
              }
            })
          } else {
            winston.error("(ibm) messengerJsonMessage is undefined!")
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
            winston.debug("(ibm) End of commands")
          }
        }, command.time)
      }
    }
    execute(commands[0]);
  }

  else if (tiledeskChannelMessage.text || tiledeskChannelMessage.metadata) {

    let messagesList = await messageHandler.splitMessageFromTiledesk(tiledeskChannelMessage);
    winston.debug("(ibm) message splitted in " + messagesList.length + " messages");

    let j = 0;
    async function send(message) {
      let messengerJsonMessage = await tlr.toinstagram(message, messenger_receiver);
      winston.verbose("(ibm) messengerJsonMessage", messengerJsonMessage)

      if (messengerJsonMessage) {
        fbClient.send(messengerJsonMessage, page_detail.access_token).then((response) => {
          winston.verbose("(ibm) Message sent to Messenger!" + response.status + " " + response.statusText);
          j += 1;
          if (j < messagesList.length) {
            send(messagesList[j])
          } else {
            winston.debug("(ibm) End of splitted message")
          }
        }).catch((err) => {
          winston.error("(ibm) error send message: ", err)
        })
      } else {
        winston.error("(ibm) messengerJsonMessage is undefined!")
      }
    }
    send(messagesList[0]);

  }

  else {
    winston.debug("(ibm) no command, no text --> skip")
  }

  return res.status(200).send({ message: "sent" });
})

router.post('/webhookFB', async (req, res) => {

  winston.verbose("(fbm) Message received from Instagram");
  console.log("message recived from instagram ===============>",req.body);

  let body = req.body;
  if (body.object === 'page') {

    let page_id = body.entry[0].id;
    // let PAGE_KEY = "messenger-page-" + page_id;
    let info_settings = await db.get(PAGE_KEY);

    if (!info_settings) {
      winston.debug("(fbm) Instagram page not enabled --> Skip")
      return res.status(200).send('EVENT_RECEIVED');
    }

    let project_id = info_settings.project_id;
    winston.debug("(fbm) project_id: " + project_id);

    let CONTENT_KEY = "instagram-" + project_id;
    let settings = await db.get(CONTENT_KEY);

    body.entry.forEach(async (entry) => {

      let messengerChannelMessage = entry.messaging[0];
      winston.debug("(fbm) webhook_event: ", messengerChannelMessage);

      const tlr = new TiledeskInstagramTranslator();
      const tdChannel = new TiledeskChannel({ settings: settings, API_URL: API_URL })
      const fbClient = new InstagramClient({ GRAPH_URL: GRAPH_URL, FB_APP_ID: FB_APP_ID, APP_SECRET: APP_SECRET, BASE_URL: BASE_URL });

      const page = settings.pages.find(p => p.id === page_id);

      let user_info = await fbClient.getUserInfo(page.access_token, messengerChannelMessage.sender.id)
      messengerChannelMessage.sender.fullname = user_info.first_name + " " + user_info.last_name;

      winston.debug("(fbm) page: " + page);
      winston.debug("(fbm) user_info: ", user_info);

      let message_info = {
        channel: TiledeskInstagramTranslator.CHANNEL_NAME,
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

router.get('/oauth', async (req, res) => {
  winston.verbose("(ibm) /oauth")

  let project_id = JSON.parse(req.query.state).project_id;
  var code = req.query.code;
  let token = JSON.parse(req.query.state).token;
  let app_id = JSON.parse(req.query.state).app_id;

  const tdClient = new TiledeskSubscriptionClient({ API_URL: API_URL, project_id: project_id, token: token })
  const instaClient = new InstagramClient({ GRAPH_URL: GRAPH_URL, FB_APP_ID: FB_APP_ID, APP_SECRET: APP_SECRET, BASE_URL: BASE_URL });

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


// router.post('/enablePage', async (req, res) => {
//   winston.verbose("(ibm) /enablePage")

//   let page_name = req.body.page_name;
//   let project_id = req.body.project_id;
//   let token = req.body.token;

//   let CONTENT_KEY = "instagram-" + project_id;

//   let settings = await db.get(CONTENT_KEY);

//   let page = settings.pages.find(e => e.name == page_name);

//   let KEY = "instagram-page-" + page.id;

//   let page_info = await db.get(KEY);
//   winston.debug("(ibm) page_info: ", page_info);

//   const tdChannel = new TiledeskChannel({ settings: { project_id: project_id, token: token }, API_URL: API_URL })
//   let departments = await tdChannel.getDepartments(token);

//   if (!page_info) {
//     // pagina non attiva per nessun progetto
//     await db.set(KEY, { project_id: project_id });

//     // ------------------------------------------------
//     // delete current active page key if exists
//     let current_active_page = settings.pages.find(e => e.active == true);
//     if (current_active_page) {
//       winston.debug("(ibm) delete current_active_page key: " + current_active_page.id);
//       let TO_DELETE_KEY = "instagram-page-" + current_active_page.id;
//       db.remove(TO_DELETE_KEY)
//     }
//     // ------------------------------------------------

//     settings.pages.forEach((page) => {
//       page.active = false;
//     })
//     settings.pages.find(e => e.name == page_name).active = true;
//     await db.set(CONTENT_KEY, settings);

//     readHTMLFile('/configure.html', (err, html) => {
//       var template = handlebars.compile(html);
//       var replacements = {
//         app_version: pjson.version,
//         project_id: project_id,
//         connected: true,
//         token: token,
//         endpoint: BASE_URL,
//         pages: settings.pages,
//         department_id: settings.department_id,
//         departments: departments,
//         brand_name: BRAND_NAME
//       }
//       var html = template(replacements)
//       return res.send(html);
//     })

//   } else {
//     // pagina attiva per qualche progetto --> reject
//     winston.verbose("Page already in use in another project");
//     let alert = "Unable to activate " + page_name + ". Page already in use in another project."

//     readHTMLFile('/configure.html', (err, html) => {
//       var template = handlebars.compile(html);
//       var replacements = {
//         app_version: pjson.version,
//         project_id: project_id,
//         connected: true,
//         token: token,
//         endpoint: BASE_URL,
//         pages: settings.pages,
//         department_id: settings.department_id,
//         departments: departments,
//         brand_name: BRAND_NAME,
//         show_alert_modal: true
//       }
//       var html = template(replacements)
//       return res.send(html);
//     })
//   }
// })

// router.post('/disablePage', async (req, res) => {
//   winston.verbose("(ibm) disablePage");

//   let page_name = req.body.page_name;
//   let project_id = req.body.project_id;
//   let token = req.body.token;

//   let CONTENT_KEY = "instagram-" + project_id;

//   let settings = await db.get(CONTENT_KEY);

//   let page = settings.pages.find(e => e.name == page_name);

//   let KEY = "instagram-page-" + page.id;
//   await db.remove(KEY);

//   settings.pages.forEach((page) => {
//     page.active = false;
//   })

//   await db.set(CONTENT_KEY, settings);

//   const tdChannel = new TiledeskChannel({ settings: { project_id: project_id, token: token }, API_URL: API_URL })
//   let departments = await tdChannel.getDepartments(token);
//   winston.debug("(ibm) found " + departments.length + " departments")

//   readHTMLFile('/configure.html', (err, html) => {
//     var template = handlebars.compile(html);
//     var replacements = {
//       app_version: pjson.version,
//       project_id: project_id,
//       connected: true,
//       token: token,
//       endpoint: BASE_URL,
//       pages: settings.pages,
//       department_id: settings.department_id,
//       departments: departments,
//       brand_name: BRAND_NAME
//       //displayError: true,
//       //alert: alert
//     }
//     var html = template(replacements)
//     return res.send(html);
//   })

// })

router.post('/disconnect', async (req, res) => {
  winston.verbose("(ibm) /disconnect");

  let project_id = req.body.project_id;
  let token = req.body.token;
  let subscription_id = req.body.subscription_id;

  let CONTENT_KEY = "instagram-" + project_id;

  let settings = await db.get(CONTENT_KEY);
  // const active_page = settings.pages.find(p => p.active === true);

  // if (active_page) {
  //   let PAGE_KEY = "instagram-page-" + active_page.id;
  //   await db.remove(PAGE_KEY)
  //   winston.debug("(ibm) Page deleted.");
  // }

  await db.remove(CONTENT_KEY)
  winston.verbose("(ibm) Content deleted.");

  const tdClient = new TiledeskSubscriptionClient({ API_URL: API_URL, project_id: project_id, token: token })
  tdClient.unsubscribe(settings.subscription_id).then(async (data) => {

    const tdChannel = new TiledeskChannel({ settings: { project_id: project_id, token: token }, API_URL: API_URL })
    let departments = await tdChannel.getDepartments(token);
    winston.debug("(ibm) found " + departments.length + " departments")

    readHTMLFile('/configure.html', (err, html) => {

      var template = handlebars.compile(html);
      var replacements = {
        app_version: pjson.version,
        project_id: project_id,
        token: token,
        endpoint: BASE_URL,
        departments: departments,
        brand_name: BRAND_NAME,
        redirect_uri: `https://www.instagram.com/oauth/authorize?client_id=${FB_APP_ID}&redirect_uri=${BASE_URL}/oauth?&scope=instagram_business_basic%2C%20instagram_business_manage_messages&state={"project_id":"${project_id}","app_id":"${settings.app_id}","token":"${token}"}`,
      }
      var html = template(replacements)
      return res.send(html);
    })

  }).catch((err) => {
    winston.error("(ibm) unsubscribe error: ", err);
  })


})

function startApp(settings, callback) {
  winston.info("(ibm) Starting Messenger App");

  if (!settings.MONGODB_URL) {
    winston.error("(ibm) MONGODB_URL is mandatory. Exit...");
    return callback('Missing parameter: MONGODB_URL');
  }

  if (!settings.API_URL) {
    winston.error("(ibm) API_URL is mandatory. Exit...");
    return callback('Missing parameter: API_URL');
  } else {
    API_URL = settings.API_URL;
    winston.info("(ibm) API_URL: " + API_URL);
  }

  if (!settings.BASE_URL) {
    winston.error("(ibm) BASE_URL is mandatory. Exit...");
    return callback('Missing parameter: BASE_URL')
  } else {
    BASE_URL = settings.BASE_URL;
    winston.info("(ibm) BASE_URL: " + BASE_URL);
  }

  if (!settings.DASHBOARD_BASE_URL) {
    winston.error("(ibm) DASHBOARD_BASE_URL is mandatory. Exit...");
    return callback('Missing parameter: DASHBOARD_BASE_URL');
  } else {
    DASHBOARD_BASE_URL = settings.DASHBOARD_BASE_URL;
    winston.info("(ibm) DASHBOARD_BASE_URL: " + DASHBOARD_BASE_URL)
  }

  if (!settings.APPS_API_URL) {
    winston.error("(ibm) APPS_API_URL is mandatory. Exit...");
    return callback('Missing parameter: APPS_API_URL');
  } else {
    APPS_API_URL = settings.APPS_API_URL;
    winston.info("(ibm) APPS_API_URL: " + APPS_API_URL);
  }

  if (!settings.FB_APP_ID) {
    winston.error("(ibm) FB_APP_ID is mandatory. Exit...");
    return callback('Missing parameter: FB_APP_ID');
  } else {
    FB_APP_ID = settings.FB_APP_ID;
    winston.info("(ibm) FB_APP_ID: " + FB_APP_ID);
  }

  if (!settings.FB_APP_SECRET) {
    winston.error("(ibm) APP_SECRET is mandatory. Exit...");
    return callback('Missing parameter: APP_SECRET');
  } else {
    APP_SECRET = settings.FB_APP_SECRET;
    winston.info("(ibm) APP_SECRET: " + APP_SECRET.substring(0, 8) + "************");
  }

  if (!settings.VERIFY_TOKEN) {
    winston.error("(ibm) VERIFY_TOKEN is mandatory. Exit...");
    return callback('Missing parameter: VERIFY_TOKEN');
  } else {
    VERIFY_TOKEN = settings.VERIFY_TOKEN;
    winston.info("(ibm) VERIFY_TOKEN: " + VERIFY_TOKEN.substring(0, 8) + "************");
  }

  if (!settings.GRAPH_URL) {
    winston.error("(ibm) GRAPH_URL is mandatory. Exit...");
    return callback('Missing parameter: GRAPH_URL');
  } else {
    GRAPH_URL = settings.GRAPH_URL;
    winston.info("(ibm) GRAPH_URL: " + GRAPH_URL);
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