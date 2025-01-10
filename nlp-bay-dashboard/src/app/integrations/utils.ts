export enum INTEGRATIONS_KEYS {
    BREVO = 'brevo',
    CUSTOMERIO = 'customerio',
    HUBSPOT = 'hubspot',
    OPENAI = 'openai',
    QAPLA = 'qapla',
    GSHEETS = "gsheets",
    ACTIVE_CAMPAIGN = 'active_campaign',
    JIRA = 'jira',
    KLAVIYO = 'klaviyo',
    MESSENGER = 'messenger',
    MAILCHIMP = 'mailchimp',
    MAKE = 'make',
    N8N = 'n8n',
    PIPEDRIVE = 'pipedrive',
    SALESFORCE = 'salesforce',
    TWILIO_SMS = "sms",
    TELEGRAM = 'telegram',
    TWILIO = 'twilio',
    VXML_VOICE = 'voice',
    TWILIO_VOICE = "voice-twilio",
    WHATSAPP = 'whatsapp',
    ZAPIER = 'zapier',
    ZENDESK = 'zendesk',
    ZOHO = 'zoho',
    INSTAGRAM="instagram"
}

export enum APPS_TITLE {
    WHATSAPP = "WhatsApp Business",
    MESSENGER = "Facebook Messenger",
    TELEGRAM = "Telegram",
    VXML_VOICE = "VXML Voice",
    TWILIO_SMS = "Twilio SMS",
    TWILIO_VOICE = "Twilio Voice",
    INSTAGRAM ="Instagram Business"
}

export enum INTEGRATIONS_CATEGORIES {
    AI = 'ai',
    AUTOMATION = "automation",
    CHANNEL = "channel",
    COMMUNICATION = 'communication',
    CRM = 'crm',
    ECOMMERCE = 'ecommerce',
    EMAIL = "email",
    INT_PLAT = "int_plat",
    LIVE_CHAT = "live_chat",
    STORAGE = 'storage',
    OTHER = 'other'
}

export const CATEGORIES_LIST = [
    { type: INTEGRATIONS_CATEGORIES.AI, name: "Artificial Intelligence" },
    { type: INTEGRATIONS_CATEGORIES.CHANNEL, name: "Channels" },
    // { type: INTEGRATIONS_CATEGORIES.AUTOMATION, name: "Automation" },
    // { type: INTEGRATIONS_CATEGORIES.COMMUNICATION, name: "Communication" },
    { type: INTEGRATIONS_CATEGORIES.CRM, name: "CRM" },
    // { type: INTEGRATIONS_CATEGORIES.STORAGE, name: "Data/File Storage" },
    { type: INTEGRATIONS_CATEGORIES.ECOMMERCE, name: "E-Commerce" },
    { type: INTEGRATIONS_CATEGORIES.EMAIL, name: "Email Marketing" },
    { type: INTEGRATIONS_CATEGORIES.INT_PLAT, name: "Integration Platform" },
    // { type: INTEGRATIONS_CATEGORIES.LIVE_CHAT, name: "Live Chat Support" },
    // { type: INTEGRATIONS_CATEGORIES.OTHER, name: "Other" },


    // { type: getKeyByValue(INTEGRATIONS_CATEGORIES.AI, INTEGRATIONS_CATEGORIES), name: "Artificial Intelligence" },
    // { type: getKeyByValue(INTEGRATIONS_CATEGORIES.CRM, INTEGRATIONS_CATEGORIES), name: "CRM" },
    // { type: getKeyByValue(INTEGRATIONS_CATEGORIES.ECOMMERCE, INTEGRATIONS_CATEGORIES), name: "E-Commerce" },
    // { type: getKeyByValue(INTEGRATIONS_CATEGORIES.STORAGE, INTEGRATIONS_CATEGORIES), name: "Data/File Storage" },
]


export const INTEGRATIONS_LIST: { [key: string]: { name: string, category: INTEGRATIONS_CATEGORIES, key: INTEGRATIONS_KEYS, src_icon: string, src_logo: string, pro?: boolean, plan: 'Sandbox' | 'Basic' | 'Premium' | 'Custom' } } = {
    BREVO:              { name: "Brevo",            category: INTEGRATIONS_CATEGORIES.CRM,              key: INTEGRATIONS_KEYS.BREVO,           src_icon: "assets/img/int/brevo.png",                   src_logo: "assets/img/int/brevo-logo.png",              pro: true,  plan: 'Premium' },
    CUSTOMERIO:         { name: "Customer.io",      category: INTEGRATIONS_CATEGORIES.CRM,              key: INTEGRATIONS_KEYS.CUSTOMERIO,      src_icon: "assets/img/int/customer-io-logo-color.svg",  src_logo: "assets/img/int/customerio-logo_new.svg",     pro: true,  plan: 'Premium' },
    HUBSPOT:            { name: "HubSpot",          category: INTEGRATIONS_CATEGORIES.CRM,              key: INTEGRATIONS_KEYS.HUBSPOT,         src_icon: "assets/img/int/hubspot.png",                 src_logo: "assets/img/int/hubspot-logo.svg",            pro: true,  plan: 'Premium' },
    OPENAI:             { name: "OpenAI",           category: INTEGRATIONS_CATEGORIES.AI,               key: INTEGRATIONS_KEYS.OPENAI,          src_icon: "assets/cds/images/actions/openai-icon.svg",  src_logo: "assets/img/int/openai-logo.svg",             pro: false,  plan: 'Sandbox' },
    QAPLA:              { name: "Qapla'",           category: INTEGRATIONS_CATEGORIES.ECOMMERCE,        key: INTEGRATIONS_KEYS.QAPLA,           src_icon: "assets/cds/images/actions/qapla.jpg",        src_logo: "assets/img/int/qapla-logo.png",              pro: true,  plan: 'Premium' },
    // ACTIVE_CAMPAIGN:    { name: "Active Campaign",  category: INTEGRATIONS_CATEGORIES.COMMUNICATION,    key: INTEGRATIONS_KEYS.ACTIVE_CAMPAIGN, src_icon: "assets/img/int/active-campaign-icon.jpeg",   src_logo: "assets/img/int/active-campaign-logo.png",    pro: true,  plan: 'Premium' },
    // JIRA:               { name: "Jira",             category: INTEGRATIONS_CATEGORIES.OTHER,            key: INTEGRATIONS_KEYS.JIRA,            src_icon: "assets/img/int/jira-icon.png",               src_logo: "assets/img/int/jira-logo.png",               pro: true,  plan: 'Premium'},
    // KLAVIYO:            { name: "Klaviyo",          category: INTEGRATIONS_CATEGORIES.AUTOMATION,       key: INTEGRATIONS_KEYS.KLAVIYO,         src_icon: "assets/img/int/klaviyo-icon.png",            src_logo: "assets/img/int/klaviyo-logo.png",            pro: true,  plan: 'Premium' },
    MAILCHIMP:          { name: "Mailchimp",        category: INTEGRATIONS_CATEGORIES.EMAIL,            key: INTEGRATIONS_KEYS.MAILCHIMP,       src_icon: "assets/img/int/mailchimp-icon.png",          src_logo: "assets/img/int/mailchimp-logo.png",          pro: true,  plan: 'Premium' },
    MAKE:               { name: "Make",             category: INTEGRATIONS_CATEGORIES.INT_PLAT,         key: INTEGRATIONS_KEYS.MAKE,            src_icon: "assets/img/int/make-icon.png",               src_logo: "assets/img/int/make-logo.svg",               pro: true,  plan: 'Basic'},
    N8N:                { name: "N8N",              category: INTEGRATIONS_CATEGORIES.INT_PLAT,         key: INTEGRATIONS_KEYS.N8N,             src_icon: "assets/img/int/n8n-icon.svg",                src_logo: "assets/img/int/n8n-logo.png",                pro: true,  plan: 'Sandbox'},
    // PIPEDRIVE:          { name: "Pipedrive",        category: INTEGRATIONS_CATEGORIES.CRM,              key: INTEGRATIONS_KEYS.PIPEDRIVE,       src_icon: "assets/img/int/pipedrive-icon.png",          src_logo: "assets/img/int/pipedrive-logo.png",          pro: true,  plan: 'Premium' },
    // SALESFORCE:         { name: "Salesforce",       category: INTEGRATIONS_CATEGORIES.CRM,              key: INTEGRATIONS_KEYS.SALESFORCE,      src_icon: "assets/img/int/salesforce-icon.png",         src_logo: "assets/img/int/salesforce-logo.png",         pro: true,  plan: 'Premium' },
    // ZAPIER:             { name: "Zapier",           category: INTEGRATIONS_CATEGORIES.INT_PLAT,         key: INTEGRATIONS_KEYS.ZAPIER,          src_icon: "assets/img/int/zapier-icon.png",             src_logo: "assets/img/int/zapier-logo.svg",             pro: true,  plan: 'Sandbox' },
    ZENDESK:            { name: "Zendesk",          category: INTEGRATIONS_CATEGORIES.LIVE_CHAT,        key: INTEGRATIONS_KEYS.ZENDESK,         src_icon: "assets/img/int/zendesk-icon.png",            src_logo: "assets/img/int/zendesk-logo.png",            pro: true,  plan: 'Premium' },
    // ZOHO:               { name: "Zoho",             category: INTEGRATIONS_CATEGORIES.OTHER,            key: INTEGRATIONS_KEYS.ZOHO,            src_icon: "assets/img/int/zoho-icon.png",               src_logo: "assets/img/int/zoho-logo.png",               pro: true,  plan: 'Premium' }

    // NEXT
    //GSHEETS: { name: "Google Sheets'", category: INTEGRATIONS_CATEGORIES.STORAGE, type: INTEGRATIONS_KEYS.GSHEETS, src: "assets/cds/images/actions/google_sheets.png" }
}
export const ChannelsIntregrations = [
    {
      installActionType: "internal",
      score: 0,
      channel: "whatsapp",
      status: "public",
      _id: "638a2564ccd1d40013e52125",
      logo: "https://user-images.githubusercontent.com/45603238/200829081-e6a9c7a0-9d8c-431c-a477-4880a8fd752f.png",
      title: "WhatsApp Business",
      description:
        "Use this application to connect your WhatsApp Business account to Tiledesk",
      installActionURL: "",
      runURL: "/api/modules/whatsapp/configure",
      learnMore: '{"url": "/api/modules/whatsapp/detail", "target":"_self"}',
      createdBy: "system",
      where: {
        dashboard: false,
        webchat: false,
        widget: false,
        appsstore: true,
      },
      version: "v2",
      createdAt: "2022-12-02T16:18:44.298Z",
      updatedAt: "2022-12-02T16:18:44.298Z",
      __v: 0,
    },
    {
      installActionType: "internal",
      score: 0,
      channel: "instagram",
      status: "public",
      _id: "638a2564ccd1d40013e52125",
      logo: "https://e7.pngegg.com/pngimages/648/943/png-clipart-instagram-logo-logo-instagram-computer-icons-camera-instagram-logo-text-trademark.png",
      title: "Instagram Business",
      description:
        "Use this application to connect your Instagram Business account to Tiledesk",
      installActionURL: "",
      runURL: "/api/modules/instagram/configure",
      learnMore: '{"url": "/api/modules/instagram/detail", "target":"_self"}',
      createdBy: "system",
      where: {
        dashboard: false,
        webchat: false,
        widget: false,
        appsstore: true,
      },
      version: "v2",
      createdAt: "2022-12-02T16:18:44.298Z",
      updatedAt: "2022-12-02T16:18:44.298Z",
      __v: 0,
    },
    {
      installActionType: "internal",
      score: 0,
      channel: "messenger",
      status: "public",
      _id: "6421f8093e8de70013f78a5d",
      logo: "https://static.vecteezy.com/system/resources/previews/016/716/477/original/messenger-icon-free-png.png",
      title: "Facebook Messenger",
      description:
        "Use this application to connect your Facebook Page to Tiledesk",
      installActionURL: "",
      runURL: "/api/modules/messenger/configure",
      learnMore: '{"url": "/api/modules/messenger/detail", "target":"_self"}',
      createdBy: "system",
      where: {
        dashboard: false,
        webchat: false,
        widget: false,
        appsstore: true,
      },
      version: "v2",
      createdAt: "2023-03-27T20:09:45.533Z",
      updatedAt: "2023-03-27T20:09:45.533Z",
      __v: 0,
    },
    {
      installActionType: "internal",
      score: 0,
      channel: "email",
      status: "public",
      _id: "64259aaf035da07321451424",
      logo: "https://email-transcription-app-v2.tiledesk.repl.co/images/chat-su-mail.png",
      title: "Send transcript by email",
      description: "Email transcript app",
      installActionURL: "",
      runURL: "https://email-transcription-app-v2.tiledesk.repl.co/create-mail",
      learnMore:
        '{"url": "https://email-transcription-app-v2.tiledesk.repl.co/detail", "target":"_self"}',
      createdBy: "system",
      where: {
        dashboard: true,
        webchat: true,
        widget: false,
        appsstore: true,
      },
      version: "v2",
      createdAt: "2022-12-02T16:18:44.298Z",
      updatedAt: "2022-12-02T16:18:44.298Z",
      __v: 0,
    },
    {
      installActionType: "internal",
      score: 0,
      status: "public",
      _id: "643820f0edf2f350eeb2d835",
      logo: "https://i.ibb.co/yWz3bZ5/2022-04-21-11-28-20.jpg",
      title: "Help Center",
      description:
        "Tiledesk Help Center. Encourage self-service so that your customers can solve their problems anytime.",
      installActionURL: "",
      runURL: "https://cms.tiledesk.com/?version=v3",
      learnMore:
        '{"url": "https://gethelp.tiledesk.com/categories/help-center-guide/", "target":"_self"}',
      createdBy: "system",
      where: {
        dashboard: false,
        webchat: false,
        widget: false,
        appsstore: true,
      },
      version: "v2",
      createdAt: "2022-12-02T16:18:44.298Z",
      updatedAt: "2022-12-02T16:18:44.298Z",
      __v: 0,
    },
    {
      installActionType: "internal",
      score: 0,
      channel:"telegram",
      status: "public",
      _id: "651c3b8299079300131f3ed9",
      logo: "https://user-images.githubusercontent.com/45603238/197573811-3bea5d88-9795-4dea-a553-3d18ed02d4b0.png",
      title: "Telegram",
      description:
        "Use this application to connect your Telegram Bot to Tiledesk",
      installActionURL: "",
      runURL: "/api/modules/telegram/configure",
      learnMore: '{"url": "/api/modules/telegram/detail", "target":"_self"}',
      createdBy: "system",
      where: {
        dashboard: false,
        webchat: false,
        widget: false,
        appsstore: true,
      },
      version: "v2",
      createdAt: "2023-10-03T16:04:18.421Z",
      updatedAt: "2023-10-03T16:04:18.421Z",
      __v: 0,
    },
    {
      installActionType: "internal",
      score: 0,
      channel:"sms",
      status: "public",
      _id: "6696505546425700134a576b",
      logo: "https://raw.githubusercontent.com/gab-95/images-host/main/sms.png",
      title: "Twilio SMS",
      description: "Integrate your sms exchange number with Chatbots",
      installActionURL: "",
      runURL: "/api/modules/sms/manage/configure",
      learnMore: "https://gethelp.tiledesk.com/",
      createdBy: "system",
      where: {
        dashboard: false,
        webchat: false,
        widget: false,
        appsstore: true,
      },
      version: "v2",
      createdAt: "2024-07-16T10:49:57.472Z",
      updatedAt: "2024-07-16T10:49:57.472Z",
      __v: 0,
    },
    {
      installActionType: "internal",
      score: 0,
      status: "public",
      channel:"voice-twilio",
      _id: "6734bef53cf3e1f6842bc97c",
      logo: "https://raw.githubusercontent.com/gab-95/images-host/main/voice-twilio-icon.png",
      title: "Twilio Voice",
      description: "Integrate your voice exchange number with Chatbots",
      installActionURL: "",
      runURL: "/api/modules/voice-twilio/manage/configure",
      learnMore: "https://gethelp.tiledesk.com/",
      createdBy: "system",
      where: {
        dashboard: false,
        webchat: false,
        widget: false,
        appsstore: true,
      },
      version: "v2",
      createdAt: "2024-07-16T10:49:57.472Z",
      updatedAt: "2024-07-16T10:49:57.472Z",
      __v: 0,
    },
    {
      installActionType: "internal",
      score: 0,
      status: "public",
      channel:"voice",
      _id: "67471d7b1e2bf21f5b6f02ea",
      logo: "https://raw.githubusercontent.com/gab-95/images-host/main/vxml-icon.png",
      title: "VXML Voice",
      description: "Integrate your voice exchange number with Chatbots",
      installActionURL: "",
      runURL: "/api/modules/voice/manage/configure",
      learnMore: "https://gethelp.tiledesk.com/",
      createdBy: "system",
      where: {
        dashboard: false,
        webchat: false,
        widget: false,
        appsstore: true,
      },
      version: "v2",
    },
  ];
  

export const INTEGRATION_LIST_ARRAY = [
    { name: "Brevo",            category: INTEGRATIONS_CATEGORIES.CRM,              key: INTEGRATIONS_KEYS.BREVO,           src_icon: "assets/img/int/brevo-icon.png",                src_logo: "assets/img/int/brevo-logo.png",              pro: false,  plan: 'Sandbox' },
    { name: "N8N",              category: INTEGRATIONS_CATEGORIES.INT_PLAT,         key: INTEGRATIONS_KEYS.N8N,             src_icon: "assets/img/int/n8n-icon.svg",                    src_logo: "assets/img/int/n8n-logo.png",                  pro: false,  plan: 'Sandbox'},
    { name: "Customer.io",      category: INTEGRATIONS_CATEGORIES.CRM,              key: INTEGRATIONS_KEYS.CUSTOMERIO,      src_icon: "assets/img/int/customerio-icon_new.png",         src_logo: "assets/img/int/customerio-logo_new.svg",     pro: false,  plan: 'Sandbox' },
    { name: "HubSpot",          category: INTEGRATIONS_CATEGORIES.CRM,              key: INTEGRATIONS_KEYS.HUBSPOT,         src_icon: "assets/img/int/hubspot-icon.png",                src_logo: "assets/img/int/hubspot-logo.svg",            pro: false,  plan: 'Sandbox' },
    { name: "OpenAI",           category: INTEGRATIONS_CATEGORIES.AI,               key: INTEGRATIONS_KEYS.OPENAI,          src_icon: "assets/img/int/openai-icon.svg",                 src_logo: "assets/img/int/openai-logo.svg",             pro: false,  plan: 'Sandbox' },
    { name: "Qapla'",           category: INTEGRATIONS_CATEGORIES.ECOMMERCE,        key: INTEGRATIONS_KEYS.QAPLA,           src_icon: "assets/img/int/qapla-icon.jpg",                  src_logo: "assets/img/int/qapla-logo.png",              pro: false,  plan: 'Sandbox' },
    // { name: "Active Campaign",  category: INTEGRATIONS_CATEGORIES.COMMUNICATION,    key: INTEGRATIONS_KEYS.ACTIVE_CAMPAIGN, src_icon: "assets/img/int/active-campaign-icon.jpeg",     src_logo: "assets/img/int/active-campaign-logo.png",    pro: false,  plan: 'Sandbox' },
    // { name: "Jira",             category: INTEGRATIONS_CATEGORIES.OTHER,            key: INTEGRATIONS_KEYS.JIRA,            src_icon: "assets/img/int/jira-icon.png",                 src_logo: "assets/img/int/jira-logo.png",               pro: false,  plan: 'Sandbox'},
    // { name: "Klaviyo",          category: INTEGRATIONS_CATEGORIES.AUTOMATION,       key: INTEGRATIONS_KEYS.KLAVIYO,         src_icon: "assets/img/int/klaviyo-icon.png",              src_logo: "assets/img/int/klaviyo-logo.png",            pro: false,  plan: 'Sandbox' },
    { name: "Mailchimp",        category: INTEGRATIONS_CATEGORIES.EMAIL,            key: INTEGRATIONS_KEYS.MAILCHIMP,       src_icon: "assets/img/int/mailchimp-icon.png",            src_logo: "assets/img/int/mailchimp-logo.png",          pro: false,  plan: 'Sandbox' },
    { name: "Make",             category: INTEGRATIONS_CATEGORIES.INT_PLAT,         key: INTEGRATIONS_KEYS.MAKE,            src_icon: "assets/img/int/make-icon.png",                   src_logo: "assets/img/int/make-logo.svg",               pro: false,  plan: 'Sandbox'},
    { name: "Messenger",        category: INTEGRATIONS_CATEGORIES.CHANNEL,          key: INTEGRATIONS_KEYS.MESSENGER,       src_icon: "assets/img/int/messenger-icon.png",              src_logo: "assets/img/int/messenger-logo.jpeg",         pro: false,  plan: 'Sandbox' },
    // { name: "Pipedrive",        category: INTEGRATIONS_CATEGORIES.CRM,              key: INTEGRATIONS_KEYS.PIPEDRIVE,       src_icon: "assets/img/int/pipedrive-icon.png",            src_logo: "assets/img/int/pipedrive-logo.png",          pro: false,  plan: 'Sandbox' },
    // { name: "Salesforce",       category: INTEGRATIONS_CATEGORIES.CRM,              key: INTEGRATIONS_KEYS.SALESFORCE,      src_icon: "assets/img/int/salesforce-icon.png",           src_logo: "assets/img/int/salesforce-logo.png",         pro: false,  plan: 'Sandbox' },
    { name: "Telegram",         category: INTEGRATIONS_CATEGORIES.CHANNEL,          key: INTEGRATIONS_KEYS.TELEGRAM,        src_icon: "assets/img/int/telegram-icon.png",               src_logo: "assets/img/int/telegram-logo.png",           pro: false, plan: 'Sandbox' },
    { name: "Twilio SMS",       category: INTEGRATIONS_CATEGORIES.CHANNEL,          key: INTEGRATIONS_KEYS.TWILIO_SMS,      src_icon: "assets/img/int/twilio-sms.png",                  src_logo: "assets/img/int/twilio-sms.png",              pro: false, plan: 'Sandbox' },
    { name: "VXML Voice",       category: INTEGRATIONS_CATEGORIES.CHANNEL,          key: INTEGRATIONS_KEYS.VXML_VOICE,      src_icon: "assets/img/int/vxml-icon.png",                   src_logo: "assets/img/int/vxml-icon.png",               pro: false,  plan: 'Sandbox' },
    { name: "Twilio Voice",       category: INTEGRATIONS_CATEGORIES.CHANNEL,        key: INTEGRATIONS_KEYS.TWILIO_VOICE,    src_icon: "assets/img/int/voice-twilio-icon.png",           src_logo: "assets/img/int/voice-twilio-icon.png",       pro: false,  plan: 'Sandbox' },
    { name: "WhatsApp",         category: INTEGRATIONS_CATEGORIES.CHANNEL,          key: INTEGRATIONS_KEYS.WHATSAPP,        src_icon: "assets/img/int/whatsapp-icon.png",               src_logo: "assets/img/int/whatsapp-logo.png",           pro: false,  plan: 'Sandbox' },
    { name: "Instagram",         category: INTEGRATIONS_CATEGORIES.CHANNEL,          key: INTEGRATIONS_KEYS.INSTAGRAM,        src_icon: "https://cdn-icons-png.flaticon.com/512/15713/15713420.png",               src_logo: "https://cdn-icons-png.flaticon.com/512/15713/15713420.png",           pro: false,  plan: 'Sandbox' },

    // { name: "Zapier",           category: INTEGRATIONS_CATEGORIES.INT_PLAT,         key: INTEGRATIONS_KEYS.ZAPIER,          src_icon: "assets/img/int/zapier-icon.png",               src_logo: "assets/img/int/zapier-logo.svg",             pro: false,  plan: 'Sandbox' },
    // { name: "Zendesk",          category: INTEGRATIONS_CATEGORIES.LIVE_CHAT,        key: INTEGRATIONS_KEYS.ZENDESK,         src_icon: "assets/img/int/zendesk-icon.png",              src_logo: "assets/img/int/zendesk-logo.png",            pro: false,  plan: 'Sandbox' },
    // { name: "Zoho",             category: INTEGRATIONS_CATEGORIES.OTHER,            key: INTEGRATIONS_KEYS.ZOHO,            src_icon: "assets/img/int/zoho-icon.png",                 src_logo: "assets/img/int/zoho-logo.png",               pro: false,  plan: 'Sandbox' }
    
    // NEXT
    // { name: "Google Sheets'", category: INTEGRATIONS_CATEGORIES.STORAGE, type: INTEGRATIONS_KEYS.GSHEETS, src: "assets/cds/images/actions/google_sheets.png" }
]

export const INTEGRATION_LIST_ARRAY_CLONE = [...INTEGRATION_LIST_ARRAY] 

export function getKeyByValue(value, keys) {
    const indexOfS = Object.values(keys).indexOf(value as unknown as any);
    const key = Object.keys(keys)[indexOfS];
    return key;
}


// MODELS

export class Integration {
    name: string;
    value: Object;
}

export class OpenaiIntegration extends Integration {
    constructor() {
        super();
        this.name = INTEGRATIONS_KEYS.OPENAI;
        this.value = {
            apikey: null,
            organization: null
        }
    }
}

export class QaplaIntegration extends Integration {
    constructor() {
        super();
        this.name = INTEGRATIONS_KEYS.QAPLA;
        this.value = {
            apikey: null
        }
    }
}

export class HubspotIntegration extends Integration {
    constructor() {
        super();
        this.name = INTEGRATIONS_KEYS.HUBSPOT;
        this.value = {
            apikey: null
        }
    }
}

export class CustomerioIntegration extends Integration {
    constructor() {
        super();
        this.name = INTEGRATIONS_KEYS.CUSTOMERIO;
        this.value = {
            siteid: null,
            key: null,
            apikey: null //base64 format of siteid:key
        }
    }
}

export class BrevoIntegration extends Integration {
    constructor() {
        super();
        this.name = INTEGRATIONS_KEYS.BREVO;
        this.value = {
            apikey: null
        }
    }
}

export class MakeIntegration extends Integration {
    constructor() {
        super();
        this.name = INTEGRATIONS_KEYS.MAKE;
        this.value = {}
    }
}

export class N8nIntegration extends Integration {
    constructor() {
        super();
        this.name = INTEGRATIONS_KEYS.N8N;
        this.value = {};
    }
}
