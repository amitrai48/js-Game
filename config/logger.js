var winston = require('winston');

winston.emitErrs = false; //supressing any unhandled errors

var logger = new winston.Logger({
	transports:[
		new winston.transports.File({
			level:'debug',
			filename:'./all-logs.log',
			handleExceptions:true,
			json:true,
			maxsize:5242880, //5mb
			maxFiles : 5,
			colorize:false,
			timestamp:function(){
				return new Date().toLocaleString();
			}
		}),
		new winston.transports.Console({
			level:'info',
			colorize:true,
			handleExceptions:true,
			json:true,
			timestamp:function(){
				return new Date().toLocaleString();
			}
		})
	],
	exitOnError:false
});

module.exports = logger;
module.exports.stream = {
	write:function(message,encoding){
		logger.debug(message);
	}
};

