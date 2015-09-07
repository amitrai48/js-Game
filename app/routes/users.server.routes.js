'use strict';

var users = require('../controllers/users.server.controller.js'),
	passport = require('passport');

module.exports = function(app){
	app.route('/users/highScore')
	.post(users.postHighScore);

	app.route('/signin')
	.get(users.renderSignin)
	.post(passport.authenticate('local',{
		successRedirect: '/',
		failureRedirect: '/signin',
		failureFlash: true
	}));

	app.route('/signup')
	.get(users.renderSignup)
	.post(users.signup);

	app.get('/signout',users.signout);
}