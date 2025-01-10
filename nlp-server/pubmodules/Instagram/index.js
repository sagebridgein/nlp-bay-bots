const listener = require("./listener");

const instagram = require("../../instagram-connector");
const instagramRoute = instagram.router;


module.exports = { listener: listener, instagramRoute: instagramRoute }