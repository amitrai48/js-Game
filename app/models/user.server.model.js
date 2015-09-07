'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto');

var UserSchema = new Schema({
	username:{
		type:String,
		required:true,
		index:true

	},
	password:{
		type:String,
	 	validate:[							//custom validation
	 		function(password){
	 			return password && password.length >6;
	 		},
	 		'password should be longer'
	 	]
	 },
	  salt:{
	 	type:String
	 },
	 created :{
		type: Date,
		default: Date.now  //creating a default value for a field
	}
});

UserSchema.pre('save',function(next){
	if(this.password){
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'),'base64');
		this.password = this.hashPassword(this.password);
	}
	next();
});

UserSchema.methods.hashPassword = function(password){
	return crypto.pbkdf2Sync(password,this.salt,10000,64).toString('base64');
};

UserSchema.methods.authenticate = function(password){
	return this.password === this.hashPassword(password);
};

var ScoreSchema = new Schema({
	score:{
		type:Number,
		required:true,
	},
	username:{
		type:String,
		required:true

	}
});

mongoose.model('User',UserSchema);
mongoose.model('Score',ScoreSchema);