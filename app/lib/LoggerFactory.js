const winston = require('winston');

const loggerFactory = {
    createLogger: () => {
        return winston.createLogger({
            level: 'info',
            format: winston.format.simple(),
            transports: [new winston.transports.Console(), new winston.transports.File({filename: './output.log'})]
        });
    }
};

module.exports = loggerFactory;
