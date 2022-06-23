/* This example user grabs the timestamp using mongoIDs, allowing you to get timestamps from users that have an empty `ts` field */

const { TetraChannel } = require("../dist/index.js");

// This gets osk's user info
TetraChannel.users.infos("osk").then((user) => {
  console.log(dateFromObjectId(user._id).toLocaleString());
});

/**
 * Converts a mongoID to a Date object
 * @param {string} objectId - A mongoose objectId
 * @returns {Date} - A Date object
 */
function dateFromObjectId(objectId) {
  return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
}
