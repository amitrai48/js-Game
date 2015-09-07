'use strict';

module.exports = {
	port : process.env.PORT || 8082,
	db:{
		uri:process.env.MONGOLAB_URI || 'mongodb://localhost:27017/game'
	},
	templateEngine:'swig',
	sessionCollection:'sessions',
	sessionSecret:'ambush',
	sessionCookie: {
		path: '/',
		httpOnly: true,
		secure: false,
		maxAge: null,
	},
	sessionName:'connect.sid'
};