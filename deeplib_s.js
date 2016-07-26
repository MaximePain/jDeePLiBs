//LIB SERVEUR



function serv(){
    
    
    this.start = function(){
        
        var app = require('express')(),
            server = require('http').createServer(app),
            io = require('socket.io').listen(server),
            //io2 = require('socket.io')(3000),
            //redis = require('socket.io-redis'),
            //rent = require('ent'), // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
            fs = require('fs'),
            express = require('express'),
            fps = 100;
        
        app.get('/', function(req, res){
            res.render("index.ejs");
            res.end();
        });
        
        io.on('connection', function (socket) {
            console.log('Un client est connecté !');
        });
        
        server.listen(8080);
    };
}

exports.serv = serv;