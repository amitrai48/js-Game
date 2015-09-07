'use strict';
var Score = require('mongoose').model('Score');
exports.render = function(req,res){
	var scores;
	Score.find({},{},{sort:{score:-1},skip:0,limit:10},function(err,scores){
		if(err){
			/*return res.status(500).send({message:'Some error occured'});*/
			scores=null;
		}
		scores = scores;
		console.log(scores);
		res.render('index',{
		title:'Painter Game',
		username:req.user?req.user.username : '',
		scores : scores
	});
	});
};