'use strict';

module.exports = {
	port : process.env.PORT || 8082,
	db:{
		uri:'mongodb://localhost:27017/game',
		options:{
			'user':'',
			'pass':''
		}
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