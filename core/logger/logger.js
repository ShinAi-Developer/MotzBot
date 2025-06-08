const { formatTime } = require("./../utils");
const logLabel = require("./../assets/logLabel");

function logMessage(type, message){
  console.log(`${logLabel(type)} ${message}`);
}

module.exports = {
  info: (msg) => logMessage("info", msg),
  success: (msg) => logMessage("success", msg),
  error: (msg) => logMessage("error", msg),
  message: (msgFrom, from, msg) => logMessage("message",  `Pesan ${msgFrom} dari ${from}: ${msg}`),
  sqr: (msg) => logMessage("sqr", msg),
  pcd: (msg) => logMessage("pcd", msg),
  call: (msg) => logMessage("call", msg),
  clear: () => process.stdout.write("\x1Bc")
};