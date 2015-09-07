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

var getScores = function(callback) {
    Score.find({}, {}, {
        sort: {
            score: -1
        },
        skip: 0,
        limit: 10
    }, function(err, scores) {
        callback(err, scores);
    });
}

exports.postHighScore = function(req, res) {
    if (req.user) {
        var data = {
            score: req.body.score,
            username: req.user.username
        };

        Score.findOne({
            username: data.username
        }, function(err, score) {
            if (err) {
                console.log('Error while posting score');
                return res.status(400).send({
                    message: 'Some error occured'
                });
            } else {
                console.log(score);
                if (score) {
                    if (score.score < data.score) {
                        score.score = data.score;
                        score.save(function(err) {
                            if (err)
                                return res.status(400).send({
                                    message: 'Some error occured'
                                });
                            getScores(function(err, scores) {
                                if (err)
                                    return res.status(400).send({
                                        message: 'Some error occured'
                                    });
                                res.json(scores);
                            });
                        });
                    } else {
                        getScores(function(err, scores) {
                            if (err)
                                return res.status(400).send({
                                    message: 'Some error occured'
                                });
                            res.json(scores);
                        });
                    }

                    //make a query to fetch all the scores here
                } else {
                    var scoreSave = new Score(data);
                    scoreSave.save(function(err) {
                        if (err)
                            return res.status(400).send({
                                message: 'Some error occured'
                            });

                        getScores(function(err, scores) {
                            if (err)
                                return res.status(400).send({
                                    message: 'Some error occured'
                                });
                            res.json(scores);
                        });
                    });
                }
            }
        });
    }
}
