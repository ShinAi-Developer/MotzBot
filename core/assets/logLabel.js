const c  = require("ansi-colors");
const { formatTime } = require("./../utils");

module.exports = function logLabel(type){
  const time = formatTime();
  const labels = {
    info: c.bold.yellow(`[INF - ${time}]`),
    success: c.bold.green(`[RDY - ${time}]`),
    error: c.bold.red(`[ERR - ${time}]`),
    message: c.bold.blue(`[MSG - ${time}]`),
    sqr: c.bold.yellow(`[SQR - ${time}]`),
    pcd: c.bold.yellow(`[PCD - ${time}]`),
    call: c.bold.yellow(`[CLL - ${time}]`)
  };
  return labels[type];
};