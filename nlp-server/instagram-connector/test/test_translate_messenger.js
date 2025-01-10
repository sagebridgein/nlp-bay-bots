let assert = require('assert');
const { TiledeskMessengerTranslator } = require('../tiledesk/TiledeskMessengerTranslator');
const log = false;

describe('Test Translator\n', function() {

  // TILEDESK >>>>>>>>> MESSENGER
  
  it("Translates a TEXT message from Tiledesk to Messenger", () => {
    let tiledeskChannelMessage = {
      text: 'Test Message',
      recipient: 'support-group-62c3f10152dc7400352bab0d-86a2293e-fbm-100165265511882-4236399759717094',
      attributes: {
        userFullname: 'John Doe'
      }
    }
    let messenger_receiver = tiledeskChannelMessage.recipient.substring(tiledeskChannelMessage.recipient.lastIndexOf("-") + 1);

    const tlr = new TiledeskMessengerTranslator();
    assert(tlr != null);
    const messengerJsonMessage = tlr.toMessenger(tiledeskChannelMessage, messenger_receiver);
    assert(messengerJsonMessage != null);
    assert(messengerJsonMessage.recipient);
    assert(messengerJsonMessage.recipient.id === messenger_receiver);
    assert(messengerJsonMessage.message);
    assert(messengerJsonMessage.message.text);
    assert(messengerJsonMessage.message.text === tiledeskChannelMessage.text);
    if (log) {
      console.log("(test) messengerJsonMessage: ", JSON.stringify(messengerJsonMessage, null, 2));
    }
  })

  it("Translates a message containing an IMAGE from Tiledesk to Messenger", () => {
    let tiledeskChannelMessage = {
      text: 'Image Caption', // can be empty --> " "
      type: 'image',
      recipient: 'support-group-62c3f10152dc7400352bab0d-86a2293e-fbm-100165265511882-4236399759717094',
      metadata: {
        src: 'https://fakeimageurl.com/',
        type: 'image/png'
      },
      attributes: {
        userFullname: 'John Doe'
      }
    }
    let messenger_receiver = tiledeskChannelMessage.recipient.substring(tiledeskChannelMessage.recipient.lastIndexOf("-") + 1);

    const tlr = new TiledeskMessengerTranslator();
    assert(tlr != null);
    const messengerJsonMessage = tlr.toMessenger(tiledeskChannelMessage, messenger_receiver);
    assert(messengerJsonMessage != null);
    assert(messengerJsonMessage.recipient);
    assert(messengerJsonMessage.recipient.id === messenger_receiver);
    assert(messengerJsonMessage.message);
    assert(messengerJsonMessage.message.attachment);
    assert(messengerJsonMessage.message.attachment.type);
    assert(messengerJsonMessage.message.attachment.type === 'image');
    assert(messengerJsonMessage.message.attachment.payload);
    assert(messengerJsonMessage.message.attachment.payload.url === tiledeskChannelMessage.metadata.src);
    if (log) {
      console.log("(test) messengerJsonMessage: ", JSON.stringify(messengerJsonMessage, null, 2));
    }
  })

  it("Translates a message containing a VIDEO from Tiledesk to Messenger", () => {
    let tiledeskChannelMessage = {
      text: 'Video Caption', // can be empty --> ""
      type: 'video',
      recipient: 'support-group-62c3f10152dc7400352bab0d-86a2293e-wab-104777398965560-393484506627',
      metadata: {
        src: 'https://fakevideourl.com/',
        type: 'video/mp4',
        name: 'fakevideo.mp4'
      },
      attributes: {
        userFullname: 'John Doe'
      }
    }  
    let messenger_receiver = tiledeskChannelMessage.recipient.substring(tiledeskChannelMessage.recipient.lastIndexOf("-") + 1);

    const tlr = new TiledeskMessengerTranslator();
    assert(tlr != null);
    const messengerJsonMessage = tlr.toMessenger(tiledeskChannelMessage, messenger_receiver);
    assert(messengerJsonMessage != null);
    assert(messengerJsonMessage.recipient);
    assert(messengerJsonMessage.recipient.id === messenger_receiver);
    assert(messengerJsonMessage.message);
    assert(messengerJsonMessage.message.attachment);
    assert(messengerJsonMessage.message.attachment.type);
    assert(messengerJsonMessage.message.attachment.type === 'template');
    assert(messengerJsonMessage.message.attachment.payload);
    assert(messengerJsonMessage.message.attachment.payload.template_type === 'open_graph');
    assert(messengerJsonMessage.message.attachment.payload.elements);
    assert(messengerJsonMessage.message.attachment.payload.elements.length > 0);
    assert(messengerJsonMessage.message.attachment.payload.elements[0].url === tiledeskChannelMessage.metadata.src);
    if (log) {
      console.log("(test) messengerJsonMessage: ", JSON.stringify(messengerJsonMessage, null, 2));
    }
  })

  it("Translates a message containing a DOCUMENT from Tiledesk to Messenger", () => {
    let tiledeskChannelMessage = {
      text: 'Document Caption', // can be empty --> ""
      type: 'application',
      recipient: 'support-group-62c3f10152dc7400352bab0d-86a2293e-wab-104777398965560-393484506627',
      metadata: {
        src: 'https://fakedocumenturl.com/',
        name: "fakedocument.pdf",
        type: 'application/pdf'
      },
      attributes: {
        userFullname: 'John Doe'
      }
    }  
    let messenger_receiver = tiledeskChannelMessage.recipient.substring(tiledeskChannelMessage.recipient.lastIndexOf("-") + 1);

    const tlr = new TiledeskMessengerTranslator();
    assert(tlr != null);
    const messengerJsonMessage = tlr.toMessenger(tiledeskChannelMessage, messenger_receiver);
    assert(messengerJsonMessage != null);
    assert(messengerJsonMessage.recipient);
    assert(messengerJsonMessage.recipient.id === messenger_receiver);
    assert(messengerJsonMessage.type);
    assert(messengerJsonMessage.type === 'document');
    assert(messengerJsonMessage.document);
    assert(messengerJsonMessage.document.link);
    assert(messengerJsonMessage.document.link === tiledeskChannelMessage.metadata.src);
    assert(messengerJsonMessage.document.caption === tiledeskChannelMessage.metadata.name || tiledeskChannelMessage.text);
    if (log) {
      console.log("(test) messengerJsonMessage: ", JSON.stringify(messengerJsonMessage, null, 2));
    }
  })

  it("Translates a message with QUICK REPLIES from Tiledesk to Messenger", () => {

    let tiledeskChannelMessage = {
      text: 'Test Message',
      recipient: 'support-group-62c3f10152dc7400352bab0d-86a2293e-wab-104777398965560-393484506627',
      attributes: {
        attachment: {
          buttons: [
            { type: 'text', value: 'Button 1' },
            { type: 'text', value: 'Button 2' },
            { type: 'text', value: 'Button 3' },
          ]
        }
      }
    }
    let messenger_receiver = tiledeskChannelMessage.recipient.substring(tiledeskChannelMessage.recipient.lastIndexOf("-") + 1);

    const tlr = new TiledeskMessengerTranslator();
    assert(tlr != null);
    const messengerJsonMessage = tlr.toMessenger(tiledeskChannelMessage, messenger_receiver);
    assert(messengerJsonMessage != null);
    assert(messengerJsonMessage.recipient);
    assert(messengerJsonMessage.recipient.id === messenger_receiver);
    assert(messengerJsonMessage.messaging_type);
    assert(messengerJsonMessage.messaging_type === "RESPONSE");
    assert(messengerJsonMessage.message);
    assert(messengerJsonMessage.message.text);
    assert(messengerJsonMessage.message.text === tiledeskChannelMessage.text);
    assert(messengerJsonMessage.message.quick_replies);
    assert(messengerJsonMessage.message.quick_replies.length === 3);
    tiledeskChannelMessage.attributes.attachment.buttons.forEach((button, index) => {
      assert(messengerJsonMessage.message.quick_replies[index].content_type === "text");
      assert(messengerJsonMessage.message.quick_replies[index].title === button.value);
      assert(messengerJsonMessage.message.quick_replies[index].payload === button.value);
    })
    if (log) {
      console.log("(test) messengerJsonMessage: ", JSON.stringify(messengerJsonMessage, null, 2));
    }
   
  })
  
  it("Translates a message with ACTIONS from Tiledesk to Whatsapp", () =>  {

    let tiledeskChannelMessage = {
      text: 'Test Message',
      recipient: 'support-group-62c3f10152dc7400352bab0d-86a2293e-wab-104777398965560-393484506627',
      attributes: {
        attachment: {
          buttons: [
            { type: 'action', value: 'Action 1', action: '#36a29fd4-1111-4964-b826-000000000001' },
            { type: 'action', value: '↩︎ Back', action: '#36a29fd4-1111-4964-b826-000000000002' }
          ]
        }
      }
    }
    let messenger_receiver = tiledeskChannelMessage.recipient.substring(tiledeskChannelMessage.recipient.lastIndexOf("-") + 1);

    const tlr = new TiledeskMessengerTranslator();
    assert(tlr != null);
    const messengerJsonMessage = tlr.toMessenger(tiledeskChannelMessage, messenger_receiver);
    assert(messengerJsonMessage != null);
    assert(messengerJsonMessage.recipient);
    assert(messengerJsonMessage.recipient.id === messenger_receiver);
    assert(messengerJsonMessage.messaging_type);
    assert(messengerJsonMessage.messaging_type === "RESPONSE");
    assert(messengerJsonMessage.message);
    assert(messengerJsonMessage.message.attachment);
    assert(messengerJsonMessage.message.attachment.type === "template");
    assert(messengerJsonMessage.message.attachment.payload);
    assert(messengerJsonMessage.message.attachment.payload.template_type === "button");
    assert(messengerJsonMessage.message.attachment.payload.text === tiledeskChannelMessage.text);
    assert(messengerJsonMessage.message.attachment.payload.buttons.length === tiledeskChannelMessage.attributes.attachment.buttons.length);    
    tiledeskChannelMessage.attributes.attachment.buttons.forEach((button, index) => {
      assert(messengerJsonMessage.message.attachment.payload.buttons[index].type === "postback");
      assert(messengerJsonMessage.message.attachment.payload.buttons[index].title === button.value);
      assert(messengerJsonMessage.message.attachment.payload.buttons[index].payload === button.action);
    })
    if (log) {
      console.log("(test) messengerJsonMessage: ", JSON.stringify(messengerJsonMessage, null, 2));
    }
  })

  it("Translates a message with QUICK_REPLIES and ACTIONS from Tiledesk to Whatsapp", () =>  {

    let tiledeskChannelMessage = {
      text: 'Test Message',
      recipient: 'support-group-62c3f10152dc7400352bab0d-86a2293e-wab-104777398965560-393484506627',
      attributes: {
        attachment: {
          buttons: [
            { type: 'text', value: 'Button 1' },
            { type: 'text', value: 'Button 2' },
            { type: 'action', value: 'Action 1', action: '#36a29fd4-1111-4964-b826-000000000001' },
            { type: 'action', value: '↩︎ Back', action: '#36a29fd4-1111-4964-b826-000000000002' }
          ]
        }
      }
    }
    let messenger_receiver = tiledeskChannelMessage.recipient.substring(tiledeskChannelMessage.recipient.lastIndexOf("-") + 1);

    const tlr = new TiledeskMessengerTranslator();
    assert(tlr != null);
    const messengerJsonMessage = tlr.toMessenger(tiledeskChannelMessage, messenger_receiver);
    assert(messengerJsonMessage != null);
    assert(messengerJsonMessage.recipient);
    assert(messengerJsonMessage.recipient.id === messenger_receiver);
    assert(messengerJsonMessage.messaging_type);
    assert(messengerJsonMessage.messaging_type === "RESPONSE");
    assert(messengerJsonMessage.message);
    assert(!messengerJsonMessage.message.text)
    assert(messengerJsonMessage.message.attachment);
    assert(messengerJsonMessage.message.quick_replies);
    assert(messengerJsonMessage.message.attachment.payload);
    assert(messengerJsonMessage.message.attachment.payload.text === tiledeskChannelMessage.text);
    assert(messengerJsonMessage.message.attachment.type === "template");
    assert(messengerJsonMessage.message.attachment.payload.buttons.length === 2)
    assert(messengerJsonMessage.message.quick_replies.length === 2);
    if (log) {
      console.log("(test) messengerJsonMessage: ", JSON.stringify(messengerJsonMessage, null, 2));
    }
  })
  
  
  // MESSENGER >>>>>>>>> TILEDESK 

  it("Translates a TEXT message from Messenger to Tiledesk", async () => {
    
    let messengerChannelMessage = {
      sender: {
        id: "4236399759700000"
      },
      recipient: {
        id: "100165265510000"
      },
      timestamp: 1679482469553,
      message: {
        mid: "m_RJ6xGALYKe-dCxI3cH8hzySHpehWV9LNmKUP069YW2L_mjLymq_Y14Y5ObI1l0eV62kLlY3XsD000000000000",
        text: "Test message"
      }
    }
    messengerChannelMessage.sender.fullname = "John Doe"; // from messenger contacts

    const tlr = new TiledeskMessengerTranslator();
    assert(tlr != null);
    const tiledeskJsonMessage = await tlr.toTiledesk(messengerChannelMessage)
    assert(tiledeskJsonMessage != null);
    assert(tiledeskJsonMessage.channel);
    assert(tiledeskJsonMessage.channel.name === TiledeskMessengerTranslator.CHANNEL_NAME);
    assert(tiledeskJsonMessage.text === messengerChannelMessage.message.text);
    assert(tiledeskJsonMessage.senderFullname === messengerChannelMessage.sender.fullname);
    if (log) {
      console.log("(test) tiledeskJsonMessage: ", JSON.stringify(tiledeskJsonMessage, null, 2));
    }
    
  })

  it("Translates a message with QUICK REPLY from Messeger to Tiledesk", async () => {

    let messengerChannelMessage = {
      sender: {
        id: "4236399759700000"
      },
      recipient: {
        id: "100165265510000"
      },
      timestamp: 1679482469553,
      message: {
        mid: "m_RJ6xGALYKe-dCxI3cH8hzySHpehWV9LNmKUP069YW2L_mjLymq_Y14Y5ObI1l0eV62kLlY3XsD000000000000",
        text: "Button 1",
        quick_reply: {
          payload: "Button 1"
        }
      }
    }
    messengerChannelMessage.sender.fullname = "John Doe"; // from messenger contacts

    const tlr = new TiledeskMessengerTranslator();
    assert(tlr != null);
    const tiledeskJsonMessage = await tlr.toTiledesk(messengerChannelMessage)
    assert(tiledeskJsonMessage != null);
    assert(tiledeskJsonMessage.channel);
    assert(tiledeskJsonMessage.channel.name === TiledeskMessengerTranslator.CHANNEL_NAME);
    assert(tiledeskJsonMessage.text === messengerChannelMessage.message.quick_reply.payload);
    assert(tiledeskJsonMessage.senderFullname === messengerChannelMessage.sender.fullname);
    if (log) {
      console.log("(test) tiledeskJsonMessage: ", JSON.stringify(tiledeskJsonMessage, null, 2));
    }
    
  })

  it("Translates a message with ACTION REPLY from Messeger to Tiledesk", async () => {

    let messengerChannelMessage = {
      sender: {
        id: "4236399759700000"
      },
      recipient: {
        id: "100165265510000"
      },
      timestamp: 1679482469553,
      postback: {
        title: "Action 1",
        payload: "#36a29fd4-1111-4964-b826-000000000000",
        mid: "m_RJ6xGALYKe-dCxI3cH8hzySHpehWV9LNmKUP069YW2L_mjLymq_Y14Y5ObI1l0eV62kLlY3XsD000000000000"
      }
    }
    messengerChannelMessage.sender.fullname = "John Doe"; // from messenger contacts
  
    const tlr = new TiledeskMessengerTranslator();
    assert(tlr != null);
    const tiledeskJsonMessage = await tlr.toTiledesk(messengerChannelMessage)
    assert(tiledeskJsonMessage != null);
    assert(tiledeskJsonMessage.channel);
    assert(tiledeskJsonMessage.channel.name === TiledeskMessengerTranslator.CHANNEL_NAME);
    assert(tiledeskJsonMessage.type === "text");
    assert(tiledeskJsonMessage.text === "");
    assert(tiledeskJsonMessage.senderFullname === messengerChannelMessage.sender.fullname);
    assert(tiledeskJsonMessage.attributes);
    assert(tiledeskJsonMessage.attributes.action);
    assert(tiledeskJsonMessage.attributes.action === messengerChannelMessage.postback.payload);
    assert(tiledeskJsonMessage.attributes.subtype);
    assert(tiledeskJsonMessage.attributes.subtype === "info");

    if (log) {
      console.log("(test) tiledeskJsonMessage: ", JSON.stringify(tiledeskJsonMessage, null, 2));
    }
    
  })

  it("Translates a message with an IMAGE from Messenger to Tiledesk", async () => {

    let messengerChannelMessage = {
      sender: {
        id: "4236399759700000"
      },
      recipient: {
        id: "100165265510000"
      },
      timestamp: 1679482469553,
      message: {
        mid: "m_RJ6xGALYKe-dCxI3cH8hzySHpehWV9LNmKUP069YW2L_mjLymq_Y14Y5ObI1l0eV62kLlY3XsD000000000000",
        attachments: [
          {
            type: "image",
            payload: {
              url: "https://fakeimageurl.com/"
            }
          }
        ]
      }
    }
    messengerChannelMessage.sender.fullname = "John Doe"; // from messenger contacts
  
    const tlr = new TiledeskMessengerTranslator();
    assert(tlr != null);
    const tiledeskJsonMessage = await tlr.toTiledesk(messengerChannelMessage)
    assert(tiledeskJsonMessage != null);
    assert(tiledeskJsonMessage.channel);
    assert(tiledeskJsonMessage.channel.name === TiledeskMessengerTranslator.CHANNEL_NAME);
    assert(tiledeskJsonMessage.senderFullname === messengerChannelMessage.sender.fullname);
    assert(tiledeskJsonMessage.type === "image");
    assert(tiledeskJsonMessage.text === "Attached image");
    assert(tiledeskJsonMessage.metadata);
    assert(tiledeskJsonMessage.metadata.src === messengerChannelMessage.message.attachments[0].payload.url);
    
    if (log) {
      console.log("(test) tiledeskJsonMessage: ", JSON.stringify(tiledeskJsonMessage, null, 2));
    }
    
  })

  it("Translates a message with a VIDEO from Messenger to Tiledesk", async () => {

    let messengerChannelMessage = {
      sender: {
        id: "4236399759700000"
      },
      recipient: {
        id: "100165265510000"
      },
      timestamp: 1679482469553,
      message: {
        mid: "m_RJ6xGALYKe-dCxI3cH8hzySHpehWV9LNmKUP069YW2L_mjLymq_Y14Y5ObI1l0eV62kLlY3XsD000000000000",
        attachments: [
          {
            type: "video",
            payload: {
              url: "https://fakevideourl.com/"
            }
          }
        ]
      }
    }
    messengerChannelMessage.sender.fullname = "John Doe"; // from messenger contacts

    const tlr = new TiledeskMessengerTranslator();
    assert(tlr != null);
    const tiledeskJsonMessage = await tlr.toTiledesk(messengerChannelMessage)
    assert(tiledeskJsonMessage != null);
    assert(tiledeskJsonMessage.channel);
    assert(tiledeskJsonMessage.channel.name === TiledeskMessengerTranslator.CHANNEL_NAME);
    assert(tiledeskJsonMessage.senderFullname === messengerChannelMessage.sender.fullname);
    assert(tiledeskJsonMessage.type === "file");
    assert(tiledeskJsonMessage.text === ("[Download video](" + messengerChannelMessage.message.attachments[0].payload.url + ")"));
    assert(tiledeskJsonMessage.metadata.src === messengerChannelMessage.message.attachments[0].payload.url);

    if (log) {
      console.log("(test) tiledeskJsonMessage: ", JSON.stringify(tiledeskJsonMessage, null, 2));
    }
  })

  it("Translates a message with a DOCUMENT from Messenger to Tiledesk", async () => {

    let messengerChannelMessage = {
      sender: {
        id: "4236399759700000"
      },
      recipient: {
        id: "100165265510000"
      },
      timestamp: 1679482469553,
      message: {
        mid: "m_RJ6xGALYKe-dCxI3cH8hzySHpehWV9LNmKUP069YW2L_mjLymq_Y14Y5ObI1l0eV62kLlY3XsD000000000000",
        attachments: [
          {
            type: "file",
            payload: {
              url: "https://fakedocumenturl.com/"
            }
          }
        ]
      }
    }
    messengerChannelMessage.sender.fullname = "John Doe"; // from messenger contacts

    const tlr = new TiledeskMessengerTranslator();
    assert(tlr != null);
    const tiledeskJsonMessage = await tlr.toTiledesk(messengerChannelMessage)
    assert(tiledeskJsonMessage != null);
    assert(tiledeskJsonMessage.channel);
    assert(tiledeskJsonMessage.channel.name === TiledeskMessengerTranslator.CHANNEL_NAME);
    assert(tiledeskJsonMessage.senderFullname === messengerChannelMessage.sender.fullname);
    assert(tiledeskJsonMessage.type === "file");
    assert(tiledeskJsonMessage.text === ("[Download document](" + messengerChannelMessage.message.attachments[0].payload.url + ")"));
    assert(tiledeskJsonMessage.metadata.src === messengerChannelMessage.message.attachments[0].payload.url);

    if (log) {
      console.log("(test) tiledeskJsonMessage: ", JSON.stringify(tiledeskJsonMessage, null, 2));
    }
  })


})