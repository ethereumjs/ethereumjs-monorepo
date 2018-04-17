const { createLogger, format, transports } = require('winston')
const { combine, timestamp, label, printf } = format

class Logging {
  static _getFormat () {
    return printf(info => {
      return `[${info.label}] ${info.timestamp} ${info.level}: ${info.message}`
    })
  }

  static getLogger (config) {
    const logger = createLogger({
      format: combine(
        format.splat(),
        label({ label: 'ethereumjs-client' }),
        timestamp(),
        Logging._getFormat()
      ),
      level: config.loglevel,
      transports: [
        new transports.Console()
      ]
    })
    return logger
  }
}

module.exports = Logging
