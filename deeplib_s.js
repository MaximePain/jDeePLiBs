//LIB SERVEUR


var game = [];
    
var searchGame = function(idRoom){
    var result = -1;
    for(var i = 0; i < game.length; i++)
    {
        if(game[i].id == idRoom)
        {
            result = i;
        }
    }
    return result;  
};


function serv(){
    
    this.app = require('express')();
    this.server = require('http').createServer(this.app);
    this.io = require('socket.io').listen(this.server);
    this.fs = require('fs');
    this.express = require('express');
    this.toGetAr = [];
    
    
    function get(arg1, arg2){
        this.arg1 = arg1;
        this.arg2 = arg2;
        
        this.start = function(app, arg1, arg2){
            if(arg1.indexOf(':idR') > -1)
                {
                    app.get(arg1, function(req, res){
                        var nbGame = searchGame(req.params.idR);
                        if(nbGame == -1)
                        {
                            res.send("EXISTE PAS DSL");
                        }
                        else{
                            res.render(arg2);
                        }
                        res.end();
                    });
                }
            else{
                app.get(arg1, function(req, res){
                    res.render(arg2);
                    res.end();
                });
            }
        }
    }
    
    
    this.addGet = function(rep1, rep2){
        this.toGetAr.push(new get(rep1, rep2));
    };
    this.start = function(port){
        for(var i = 0; i < this.toGetAr.length; i++)
            {
                this.toGetAr[i].start(this.app, this.toGetAr[i].arg1, this.toGetAr[i].arg2);
            }
        
        this.app.use(this.express.static(__dirname));
        
        this.io.on('connection', function (socket) {
            console.log('Un client est connecté !');
        });
        
        this.server.listen(port);
    };
    
    
    
}

exports.serv = serv;