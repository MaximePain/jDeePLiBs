//Lib "system"

function deepC(){
    
    //detection key
    var Key = {
        _pressed: {},
            
            ENTER: 13,
            ADD: 107,
            SUB: 109,
            Z: 90,
            Q: 81,
            S: 83,
            D: 68,
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40,

            isDown: function(keyCode) {
                return this._pressed[keyCode];
            },

            onKeydown: function(event) {
                this._pressed[event.keyCode] = true;
            },

            onKeyup: function(event) {
                delete this._pressed[event.keyCode];
            }
        };
    this.Key = Key;
    
    
    window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
    window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);
    //window.addEventListener('keydown', function(event) { alert(event.keyCode); }, false);
    
    /*Exemple:
    if(Key.isDown(Key.UP))
             socket.emit('move', {idRoom: idRoom, idNum: idNum, x: Game.player[idNum].x, y: Game.player[idNum].y, direc: "LEFT1"});
     else
             socket.emit('move', {idRoom: idRoom, idNum: idNum, x: Game.player[idNum].x, y: Game.player[idNum].y, direc: "LEFT0"});
                
    if(Key.isDown(Key.DOWN))
              socket.emit('move', {idRoom: idRoom, idNum: idNum, x: Game.player[idNum].x, y: Game.player[idNum].y, direc: "RIGHT1"});
      else
             socket.emit('move', {idRoom: idRoom, idNum: idNum, x: Game.player[idNum].x, y: Game.player[idNum].y, direc: "RIGHT0"});
    */
    
    this.Game = {};
    
    this.while = function(fonction, fps){
        this.Game._intervalId = setInterval(fonction, 1000 / fps);
    }
    
    this.getIdRoomUrl = function(debut){
        var idRoom = window.location.pathname;
        idRoom = idRoom.replace(debut, '');  
        return idRoom;
    };
    
}

function getXMLHttpRequest() {
	var xhr = null;
	
	if (window.XMLHttpRequest || window.ActiveXObject) {
		if (window.ActiveXObject) {
			try {
				xhr = new ActiveXObject("Msxml2.XMLHTTP");
			} catch(e) {
				xhr = new ActiveXObject("Microsoft.XMLHTTP");
			}
		} else {
			xhr = new XMLHttpRequest(); 
		}
	} else {
		alert("Votre navigateur ne supporte pas l'objet XMLHTTPRequest...");
		return null;
	}
	
	return xhr;
}

if(typeof exports !== 'undefined'){
    exports.getXMLHttpRequest = getXMLHttpRequest; 
}