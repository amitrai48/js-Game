'use strict';

var User = require('mongoose').model('User');
var Score = require('mongoose').model('Score');
exports.renderSignin = function(req, res) {
    if (!req.user) {
        res.render('signin', {
            title: 'Sign in',
            messages: req.flash('error') || req.flash('info')
        });
    } else {
        return res.redirect('/');
    }
};

exports.renderSignup = function(req, res) {
    if (!req.user) {
        res.render('signup', {
            title: 'Sign up',
            messages: req.flash('error') || req.flash('info')
        });
    } else {
        return res.redirect('/');
    }
};

exports.signup = function(req, res) {
    if (!req.user) {
        var user = new User(req.body);
        user.save(function(err) {
            if (err) {
                req.flash('error', 'Could not sign up the user');
                return res.redirect('/signup');
            }
            req.login(user, function(err) {
                if (err)
                    return next(err);
                return res.redirect('/');
            });
        });
    } else {
        return res.redirect('/');
    }
};

exports.signout = function(req, res) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
};

exports.postHighScore = function(req, res) {
    if (req.user) {
        var data = {
            score: req.body.score,
            username: req.user.username
        };

        Score.findOne({
            username: data.username
        }, function(err, score) {
            if (err)
                console.log('Error while posting score');
            else {
                console.log(score);
                if (score) {
                    if (score.score < data.score) {
                        score.score = data.score;
                        score.save(function(err) {
                            console.log('Error while saving score');
                        });
                    }
                } else {
                    var scoreSave = new Score(data);
                    scoreSave.save(function(err) {
                        if (err)
                            console.log('Error while posting score');
                    });
                }
            }
             return res.redirect('/');
        });
    }
}
