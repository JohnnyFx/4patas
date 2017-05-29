var express = require('express');
var load = require('express-load');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');


module.exports = function() {
    var app = express();

    app.use(express.static('./app/public'));
    app.set('view engine', 'ejs');
    app.set('views', './app/views');


    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(expressValidator());
    app.use(flash());



    app.use(session({ cookie: { maxAge: 60000 }, 
                  secret: 'woot',
                  resave: false, 
                  saveUninitialized: false}));

    load('routes', {cwd: 'app'})
        .then('infra')
        .into(app);

    app.use(function(req, res, next) {
        res.status(404).render('erros/404');
        next();
    });

    app.use(function(error, req, res, next) {
        if(process.env.NODE_ENV == 'production') {
            res.status(500).render('erros/500');
            return;
        }
        next(error);
    });

    return app;
}
