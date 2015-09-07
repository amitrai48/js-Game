'use strict';

var config = require('./config/config'),
	mongoose = require('mongoose'),
	logger = require('./config/logger');

mongoose.connect(config.db.uri,function(err){
	if(err){
		logger.error("Error in connecting mongodb");
		logger.error(err);
	}
});

mongoose.connection.on('error',function(err){
	logger.error('Connection error in mongoose');
	process.exit(-1);
});

require('./app/models/user.server.model');

var app = require('./config/express')(mongoose.connection);
require('./config/passport')();
app.listen(config.port);
exports = module.exports = app;

logger.info('server running on port '+config.port);
