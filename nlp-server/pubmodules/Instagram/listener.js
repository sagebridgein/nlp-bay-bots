// const Instagram = require("../../instagram-connector");
// var winston = require('../../config/winston');
// var configGlobal = require('../../config/global');
// const mongoose = require("mongoose");

// const apiUrl = process.env.API_URL || configGlobal.apiUrl;
// //winston.info('Instagram apiUrl: ' + apiUrl);

// const dbConnection = mongoose.connection;

// class Listener {

//     listen(config) {
//         winston.info("Instagram Listener listen");
//         if (config.databaseUri) {
//             winston.debug("Instagram config databaseUri: " + config.databaseUri);
//         }

//         let graph_url = process.env.INSTA_GRAPH_URL || config.graphUrl || "https://graph.facebook.com/v14.0/"
//         winston.debug("Instagram graph_url: " + graph_url);

//         let log = process.env.INSTAGRAM_LOG || false
//         winston.debug("Instagram log: " + log);

//         let insta_app_id = process.env.INSTA_APP_ID;
//         winston.debug("Instagram Insta_app_id: ", insta_app_id);

//         let insta_app_secret = process.env.INSTA_APP_SECRET;
//         winston.debug("Instagram Insta_app_secret: ", insta_app_secret);
        
//         let insta_verify_token = process.env.INSTAGRAM_VERIFY_TOKEN;

//         let dashboard_base_url = process.env.EMAIL_BASEURL || config.baseUrl;
//         winston.debug("Instagram dashboard_base_url: ", dashboard_base_url);

//         let brand_name = null;
//         if (process.env.BRAND_NAME) {
//             brand_name = process.env.BRAND_NAME
//         }


//         Instagram.startApp({
//             MONGODB_URL: config.databaseUri,   
//             dbconnection: dbConnection,      
//             API_URL: apiUrl,
//             BASE_URL: apiUrl + "/modules/instagram",
//             APPS_API_URL: apiUrl + "/modules/apps",
//             INSTA_APP_ID: insta_app_id,
//             INSTA_APP_SECRET: insta_app_secret,
//             INSTA_GRAPH_URL: graph_url,
//             DASHBOARD_BASE_URL: dashboard_base_url,
//             VERIFY_TOKEN: insta_verify_token,
//             BRAND_NAME: brand_name,
//             log: log
//         }, (err) => {
//             if (!err) {
//                 winston.info("Tiledesk Instagram Connector proxy server succesfully started.");
//             } else {
//                 winston.info("unable to start Tiledesk Instagram Connector. " + err);
//             }
//         })

//     }
// }

// var listener = new Listener();

// module.exports = listener;


const messenger = require("../../instagram-connector");
var winston = require('../../config/winston');
var configGlobal = require('../../config/global');
const mongoose = require("mongoose");

const apiUrl = process.env.API_URL || configGlobal.apiUrl;
//winston.info('Messenger apiUrl: ' + apiUrl);

const dbConnection = mongoose.connection;

class Listener {

    listen(config) {
        winston.info("Messenger Listener listen");
        if (config.databaseUri) {
            winston.debug("messenger config databaseUri: " + config.databaseUri);
        }

        let graph_url = process.env.META_GRAPH_URL || config.graphUrl || "https://graph.facebook.com/v14.0/"
        winston.debug("Messenger graph_url: " + graph_url);

        let log = process.env.MESSENGER_LOG || false
        winston.debug("Messenger log: " + log);

        let fb_app_id = process.env.INSTA_APP_ID;
        winston.debug("Messenger fb_app_id: ", fb_app_id);

        let fb_app_secret = process.env.INSTA_APP_SECRET;
        winston.debug("Messenger fb_app_secret: ", fb_app_secret);
        
        let fb_verify_token = process.env.INSTAGRAM_VERIFY_TOKEN;

        let dashboard_base_url = process.env.EMAIL_BASEURL || config.baseUrl;
        winston.debug("Messenger dashboard_base_url: ", dashboard_base_url);

        let brand_name = null;
        if (process.env.BRAND_NAME) {
            brand_name = process.env.BRAND_NAME
        }


        messenger.startApp({
            MONGODB_URL: config.databaseUri,   
            dbconnection: dbConnection,      
            API_URL: apiUrl,
            BASE_URL: apiUrl + "/modules/instagram",
            APPS_API_URL: apiUrl + "/modules/apps",
            FB_APP_ID: fb_app_id,
            FB_APP_SECRET: fb_app_secret,
            GRAPH_URL: "https://api.instagram.com/",
            DASHBOARD_BASE_URL: dashboard_base_url,
            VERIFY_TOKEN: fb_verify_token,
            BRAND_NAME: brand_name,
            log: log
        }, (err) => {
            if (!err) {
                winston.info("Tiledesk Messenger Connector proxy server succesfully started.");
            } else {
                winston.info("unable to start Tiledesk Messenger Connector. " + err);
            }
        })

    }
}

var listener = new Listener();

module.exports = listener;