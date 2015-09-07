'use strict';

var express = require('express'),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	compression = require('compression'),
	helmet = require('helmet'),
	passport = require('passport'),
	logger = require('./logger'),
	mongoStore = require('connect-mongo')({
		session:session
	}),
	config = require('./config'),
	consolidate = require('consolidate'),
	path = require('path'),
	flash = require('connect-flash');

	module.exports = function(db){
		var app = express();

		  // Should be placed before express.static
    app.use(compression({
        // only compress files for the following content types
        filter: function(req, res) {
            return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
        },
        // zlib option for compression level
        level: 3
    }));

    //set swig as template engine

    app.engine('server.view.html',consolidate[config.templateEngine]);
    app.set('view engine','server.view.html');
    app.set('views','./app/views');

    //write morgan logs to logger

    app.use(morgan({format : "combined","stream":logger.stream}));

    // Request body parsing middleware should be above methodOverride
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(methodOverride());

	// Use helmet to secure Express headers
	app.use(helmet.xframe());
	app.use(helmet.xssFilter());
	app.use(helmet.nosniff());
	app.use(helmet.ienoopen());
	app.disable('x-powered-by');

	app.use(express.static(path.resolve('./public')));

	// CookieParser should be above session
	app.use(cookieParser());

	// Express MongoDB session storage
	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret,
		store: new mongoStore({
			mongooseConnection: db,
			collection: config.sessionCollection
		}),
		cookie: config.sessionCookie,
		name: config.sessionName
	}));

	// use passport session
	app.use(passport.initialize());
	app.use(passport.session());

	// connect flash for flash messages
	app.use(flash());

	require('../app/routes/index.server.routes.js')(app);
	require('../app/routes/users.server.routes.js')(app);

	return app;

}
