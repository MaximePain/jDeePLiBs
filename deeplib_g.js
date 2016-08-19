var collisionRectRect = function (A, B) {
    if (B.x - B.margin >= A.x + A.largeur + A.margin
       || B.x + B.largeur + B.margin <= A.x - A.margin
       || B.y - B.margin >= A.y + A.hauteur + A.margin
       || B.y + B.hauteur + B.margin <= A.y - A.margin)
        return false;
    else 
        return true;
};

var collisionCercCerc = function(C1, C2){
    var d = (C1.x-C2.x)*(C1.x-C2.x) + (C1.y-C2.y)*(C1.y-C2.y);
    if (d > (C1.rayon + C2.rayon)*(C1.rayon + C2.rayon))
        return false;
    else
        return true;
};

var collisionCerclePoint = function(C, x, y){
    var d = (x-C.x)*(x-C.x) + (y-C.y)*(y-C.y);
    if (d > C.rayon * C.rayon)
        return false;
    else
        return true;
};

var ProjectionSurSegment = function(Cx,Cy,Ax,Ay,Bx,By){ //merci sdz (openclassroom) pour le copie colle
   var ACx = Cx-Ax;
   var ACy = Cy-Ay; 
   var ABx = Bx-Ax;
   var ABy = By-Ay; 
   var BCx = Cx-Bx;
   var BCy = Cy-By; 
   var s1 = (ACx*ABx) + (ACy*ABy);
   var s2 = (BCx*ABx) + (BCy*ABy); 
   if (s1*s2>0)
     return false;
   return true;
};

var collisionRectCercle = function(R, C){
    var boxCercle = C.getBox();
    
    if(!collisionRectRect(R, boxCercle))
        return false;
    
    if(C.boundingPoint(R.x, R.y)
       || C.boundingPoint(R.x, R.y + R.hauteur)
       || C.boundingPoint(R.x + R.largeur, R.y)
       || C.boundingPoint(R.x + R.largeur, R.y + R.hauteur))
        return true;
    
    if(R.boundingPoint(C.x, C.y))
        return true;
    
    var projvertical = ProjectionSurSegment(C.x, C.y, R.x, R.y, R.x, R.y + R.hauteur);
    var projhorizontal = ProjectionSurSegment(C.x, C.y, R.x, R.y, R.x + R.largeur, R.y); 
    if (projvertical || projhorizontal)
        return true;
    return false;
};

var numTile = function(num, imageLarg, tileLarg, tileHaut){
    var xBrute = num % ( imageLarg / tileLarg );
    if(xBrute == 0)
        xBrute = ( imageLarg / tileLarg );
    var yBrute = Math.ceil(num / ( imageLarg / tileLarg ) );
               
    var x = (xBrute - 1) * tileLarg;
    var y = (yBrute - 1) * tileHaut;
    
    return {x: x, y: y};
};

function point(x, y){
    this.x = x;
    this.y = y;
}

function vector(Ax, Ay, Bx, By){
    this.x = Bx - Ax;
    this.y = By - Ay;
}

function View(x, y, hauteur, largeur, largIntern, hautIntern, xMap, yMap, name, idSup){ //Intern = echelle
    this.exist = true;
    this.x = x;
    this.y = y;
    this.largeur = largeur;
    this.hauteur = hauteur;
    this.largIntern = largIntern;
    this.hautIntern = hautIntern;
    this.angle = 0;
    this.xMap = xMap;
    this.yMap = yMap;
    this.canvas = document.createElement('canvas');
    this.canvas.id = name;
    this.canvas.width = largeur;
    this.canvas.height = hauteur;
    this.canvas.style.position = 'absolute';
    //this.canvas.mouseX = 0;
    //this.canvas.mouseY = 0;
    if(this.x != '100%' && this.y != '100%')
        {
            this.canvas.style.top = this.y;
            this.canvas.style.left = this.x;
        }
    document.getElementById(idSup).appendChild(this.canvas);
    
    /*this.canvas.onmousemove = function(e){
        this.mouseX = (e.clientX - parseInt(this.style.left));
        this.mouseY = (e.clientY - parseInt(this.style.top));
    };*/
    
    this.context = this.canvas.getContext('2d');
    
    
    this.colorClear = 'white';
    
    
    this.draw = function(){
        this.context.strokeStyle = 'black';
        this.context.strokeRect(0, 0, this.largeur, this.hauteur);  
        //context.setTransform(1, 0, 0, 1, 0, 0);
    };
    
    this.move = function(x, y){
        this.x += x;
        this.y += y;
    };
    this.moveView = function(x, y){
        this.xMap += x;
        this.yMap += y;
    };
    
    this.scale = function(){
        this.context.scale(this.largIntern, this.hautIntern);
        this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.context.rotate(this.angle * Math.PI / 180);
        this.context.translate(-this.canvas.width / 2, -this.canvas.height / 2);
    };
    
    this.reset = function(){
        this.context.setTransform(1, 0, 0, 1, 0, 0);
    };
    
    this.clear = function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
}

function Rect(x, y, hauteur, largeur, /*margin, context, */color, stroke, texture, tile, tileX, tileY, tileLarg, tileHaut) {
    
    this.type = "Rect";
    this.boundingType = "Rect";
    this.id = "Rect";
    
    this.x = x;
    this.y = y;
    this.hauteur = hauteur;
    this.hauteurView = 0;
    this.largeur = largeur;
    this.largeurView = 0;
    this.angle = 0;
    
    this.margin = 0;
    //this.margin = margin; // a faire
    //this.context = context;
    
    this.color = color;
    this.stroke = stroke || false;
    
    this.tile = tile || false;
    
    this.texture = texture;
    this.textureSrc = texture || "yop";
    
    
    this.tileX = tileX || 0;
    this.tileY = tileY || 0;
    this.tileLarg = tileLarg || 0;
    this.tileHaut = tileHaut || 0;
    
    this.draw = function (view) {
        var view = view || {exist: false};
        view.scale();
        
        if (!this.stroke) {
            if (this.textureSrc == "yop")
            {
                view.context.fillStyle = this.color;
                view.context.fillRect(this.x - view.xMap, this.y - view.yMap, this.largeur - this.largeurView, this.hauteur - this.hauteurView);
            }
            else{
                if(!tile)
                    view.context.drawImage(this.texture, this.x - view.xMap, this.y - view.yMap, this.largeur, this.hauteur);
                else{
                    view.context.drawImage(this.texture, this.tileX, this.tileY, this.tileLarg, this.tileHaut, this.x - view.xMap, this.y - view.yMap, this.largeur, this.hauteur);
                }
            }
        }
        else{
            view.context.strokeStyle = this.color;
            view.context.strokeRect(this.x - view.xMap, this.y - view.yMap, this.largeur - this.largeurView, this.hauteur - this.hauteurView);
        }
        view.reset();
    };
    this.move = function (x, y) {
        this.x += x;
        this.y += y;
    };
    this.setPos = function (x, y) {
        this.x = x;
        this.y = y;
    };
    this.boundingPoint = function (x, y) {
        if( ( ( x <= (this.x + this.largeur + this.margin) ) && ( x >= this.x - this.margin) ) && ( ( y <= (this.y + this.hauteur + this.margin) ) && ( y >= this.y - this.margin) ) )
            return true;
        else
            return false; 
    };
    this.boundingObj = function (object) {
        if(object.boundingType == "Rect")
        {
            return collisionRectRect(this, object);
        }
        else if(object.boundingType == "Cercle"){
            return collisionRectCercle(this, object);
        }
    };
    this.boundingTileObj = function(mapLayer, name){
        var rtn = false;
        for(var i = 0; i < mapLayer.obj.length; i++)
            {
                if(mapLayer.obj[i].id == name)
                    if(this.boundingObj(mapLayer.obj[i]))
                        rtn = true;
            }
        return rtn;
    };
}

function Cercle(x, y, rayon, context, color, stroke, texture){
    this.type = "Cercle";
    this.boundingType = "Cercle";
    
    this.x = x;
    this.y = y;
    this.rayon = rayon;
    this.box = {
        x: 0,
        y: 0,
        hauteur: 0,
        largeur: 0,
        margin: 0
    };
    
    this.context = context;
    this.color = color;
    this.stroke = stroke || false;
    this.texture = new Image();
    this.textureSrc = texture || "yop";
    this.texture.src = this.textureSrc;
    
    
    this.draw = function () {
        if (!this.stroke) {
                if (this.textureSrc == "yop")
                    {
                        this.context.fillStyle = this.color;
                        this.context.beginPath();
                        this.context.arc(this.x, this.y, this.rayon, 0, Math.PI * 2);
                        this.context.fill();
                    }
                else{

                }
            }
        else{
            this.context.strokeStyle = this.color;
            this.context.beginPath();
            this.context.arc(this.x, this.y, this.rayon, 0, Math.PI * 2);
            this.context.stroke();
        }
    
    };
    this.move = function (x, y) {
        this.x += x;
        this.y += y;
    };
    this.setPos = function (x, y) {
        this.x = x;
        this.y = y;
    };
    this.getBox = function(){
        this.box.x = this.x - this.rayon;
        this.box.y = this.y - this.rayon;
        this.box.hauteur = this.rayon * 2;
        this.box.largeur = this.rayon * 2;
        return this.box;
    }
    this.boundingPoint = function(x, y){
        //d=sqrt((x−C.x)²+(y−C.y)²)              d²=(x−C.x)²+(y−C.y)²
        return collisionCerclePoint(this, x, y);
        
    };
    this.boundingObj = function(object){
        if(object.boundingType == "Rect")
            return collisionRectCercle(object, this);
        else if(object.boundingType == "Cercle")
            return collisionCercCerc(this, object);
    };
    this.boundingTileObj = function(mapLayer, name){
        var rtn = false;
        for(var i = 0; i < mapLayer.obj.length; i++)
            {
                if(mapLayer.obj[i].id == name)
                    if(this.boundingObj(mapLayer.obj[i]))
                        rtn = true;
            }
        return rtn;
    };
    
}

function AnimSet(sprite, num1, num2, tileLarg, tileHaut, time, repeat, reverse){
    var max = false;
    this.sprite = sprite;
    this.num1 = num1;
    this.num2 = num2;
    this.num = {Value:  this.num1};
    this.reverse = reverse;
    
    this.animStop = true;
    this.first = true;
    this.repeat = repeat;
    this.time = [];
    for(var i = num1; i < num2 + 1; i++)
        this.time.push(time);

    
    this.tileLarg = tileLarg;
    this.tileHaut = tileHaut;
    
    
    this.anim = function(obj){
        //console.log(obj.num.Value);
        if(obj.first)
            {
                obj.first = false;
                if(obj.reverse)
                    obj.num.Value = obj.num2;
                else
                    obj.num.Value = obj.num1;
            }
        var xy = numTile(obj.num.Value, obj.sprite.texture.width, obj.tileLarg, obj.tileHaut);
        var x = xy.x;
        var y = xy.y;
        
        obj.sprite.tileLarg = obj.tileLarg;
        obj.sprite.tileHaut = obj.tileHaut;
        obj.sprite.tileX = x;
        obj.sprite.tileY = y;
        
        
        if(!obj.animStop){
            //console.log('num: ' + obj.num.Value + '  time: ' +  obj.time[obj.num.Value]);
            if(!obj.reverse)
                if(obj.num.Value < obj.num2)
                    obj.num.Value++;
                else
                    max = true;
            else
                if(obj.num.Value > obj.num1)
                    obj.num.Value--;   
                else
                    max = true;
            if(max)
                {
                    max = false;
                    if(obj.repeat)
                        if(obj.reverse)
                            obj.num.Value = obj.num2;
                        else
                            obj.num.Value = obj.num1;
                    else
                        obj.animStop = true;
                }

            setTimeout(obj.anim, obj.time[obj.num.Value - obj.num1], obj);
        }
    };
}

function AnimSprite(x, y, hauteur, largeur, tile, tileHaut, tileLarg, objectType){
    this.x = x;
    this.y = y;
    this.hauteur = hauteur;
    this.largeur = largeur;
    this.tile = tile;
    this.tileLarg = tileLarg;
    this.tileHaut = tileHaut;
    this.objectType = objectType || "Rect";
    
    this.globalTime = 100;
    this.animLs = {};
    this.currentAnim = {Value: "NULL"};
    
    if(this.objectType == "Rect")
        this.sprite = new Rect(this.x, this.y, this.hauteur, this.largeur, "black", false, this.tile, true);

    
    this.startAnim = function(blockReset){
        var blockReset = blockReset || false;
        if(this.animLs[this.currentAnim.Value].animStop != false){
            this.animLs[this.currentAnim.Value].animStop = false;
            if(blockReset)
                this.animLs[this.currentAnim.Value].first = false;
            this.animLs[this.currentAnim.Value].anim(this.animLs[this.currentAnim.Value]);
        }
    };
    
    this.stopAnim = function(reset){
        if(reset)
            this.animLs[this.currentAnim.Value].first = true;
        this.animLs[this.currentAnim.Value].animStop = true;
    };
    
    this.getFrame = function(){
        return this.animLs[this.currentAnim.Value].num.Value;
    };
    
    this.setFrame = function(nb){
        this.animLs[this.currentAnim.Value].num.Value = nb;
    }
    
    this.addAnim = function(name, num1, num2, time, repeat, reverse){
        this.animLs[name] = new AnimSet(this.sprite, num1, num2, this.tileLarg, this.tileHaut, time, repeat, reverse);
    };
    
    this.isPlaying = function(){
        return !this.animLs[this.currentAnim.Value].animStop;
    };
    
    this.setReverse = function(reverse){
        this.animLs[this.currentAnim.Value].reverse = reverse;
    };
    
    this.set = function(name){
        this.stopAnim();
        this.currentAnim.Value = name;
    };
    
    this.draw = function(view){
        var view = view || {x: 0, y: 0, largeur: 1280, hauteur: 720, largIntern: 1, hautIntern: 1, xMap: 0, yMap: 0, exist: false};
        this.sprite.draw(view);  
    };
    
    this.timeFrame = function(frame, time){
          this.animLs[this.currentAnim.Value].time[frame] = time;
    };
    
    this.move = function(x, y){
        this.sprite.move(x, y);
    };
    
    this.boundingObj = function(object){
        return this.sprite.boundingObj(object);
    };
    
    this.boundingTileObj = function(mapLayer, name){
        return this.sprite.boundingTileObj(mapLayer, name);
    };
    
    this.addAnim("NULL", 0, 0, 1000);
    //this.interv = setInterval(this.animWhile, this.globalTime, this.animLs, this.currentAnim);
    
}

function Particle(coord, angleVar, speedVar, lifetime){ // *Var != variable / *Var == variation    Var: min: x, max: x, random: true || false, increase: x
    this.view = view;
    this.system = 0;
    this.x = coord.x;
    this.y = coord.y;
    this.height = 10;
    this.width = 10;
    this.speedVar = speedVar;
    this.speed = 0;
    this.angleVar = angleVar;
    this.angle = -1;
    this.lifetime = lifetime; //variation plus tard
    this.alive = true;
    this.color = 'black';
    this.obj = new Rect(this.x, this.y, this.height, this.width, this.color, false);
    
    if(!this.speedVar.random)
        this.speed = (Math.random() * (this.speedVar.max - this.speedVar.min ) ) + this.speedVar.min;
    
    if(!this.angleVar.random)
        this.angle = (Math.random() * (this.angleVar.max - this.angleVar.min ) ) + this.angleVar.min;
    
    this.update = function(obj){
        obj.lifetime--;
        //console.log('lifetime: ' + obj.lifetime);
        if(obj.lifetime > 0)
            {
                if(obj.angleVar.random)
                    obj.angle = (Math.random() * (obj.angleVar.max - obj.angleVar.min) ) + obj.angleVar.min;
                else{
                    if(obj.angle < 0)
                        obj.angle = obj.angleVar.min;
                    else if(obj.angle <= obj.angleVar.max)
                        obj.angle += obj.angleVar.increase;
                }
            
                if(obj.speedVar.random)
                    obj.speed = (Math.random() * (obj.speedVar.max - obj.speedVar.min ) ) + obj.speedVar.min;
                else{
                    if(obj.speed == 0)
                        obj.speed = obj.speedVar.min;
                    else if(obj.speed <= obj.speedVar.max)
                        obj.speed += obj.speedVar.increase;
                }
                obj.obj.move(Math.cos(obj.angle * (Math.PI / 180)).toFixed(5) * obj.speed, Math.sin(obj.angle * (Math.PI / 180)).toFixed(5) * obj.speed);
                
                setTimeout(obj.update, obj.speed, obj);
            }
        else{
            delete obj;
            obj.system.deleteParticle(obj);
        }
    };
    
    this.draw = function(view){
        this.obj.draw(view);
    }
}

function ParticleEmitter(system){
    this.system = system;
    this.x = 0;
    this.y = 0;
    this.speed = 100;
    this.speedParticle;
    this.angle = 0;
    this.angleParticle;
    this.lifetime;
    
    this.update = function(obj){
        obj.system.particle.push(new Particle({x: obj.x, y: obj.y}, {min: obj.angleParticle.min + obj.angle, max: obj.angleParticle.max + obj.angle, random: obj.angleParticle.random, increase: obj.angleParticle.increase}, obj.speedParticle, obj.lifetime));
        obj.system.particle[obj.system.particle.length - 1].system = obj.system; 
        //console.log(obj.system.particle[obj.system.particle.length - 1]);
        obj.system.particle[obj.system.particle.length - 1].update(obj.system.particle[obj.system.particle.length - 1]);
        setTimeout(obj.update, obj.speed, obj);
    };
    
    this.start = function(){
        this.update(this);
    };
}

function ParticleSystem(){
    this.particle = [];
    this.emitter = [];
    this.particleDelete = [];
    
    this.update = function(obj){
        if(obj.particle.length != 0)
            for(var i = 0; i < obj.particle.length; i++)
                if(obj.particle[0] === undefined)
                    obj.particle.shift();
        
        setTimeout(obj.update, 100, obj);
    };
    
    this.deleteParticle = function(particle){
        for(var i = 0; i < this.particle.length; i++)
            if(this.particle[i] === particle)
                delete this.particle[i];
    };
    
    this.draw = function(view){
        for(var i = 0; i < this.particle.length; i++)
            if(this.particle[i] !== undefined)
                this.particle[i].draw(view);
    };
    
    this.update(this);
}

function Layer(taille, tileset, hauteur, largeur){ //tile = image
    this.taille = taille;
    this.tile = tileset;
    this.hauteur = hauteur;
    this.largeur = largeur;
    
    if(this.hauteur == -1)
        this.hauteur = this.taille;
    if(this.largeur == -1)
        this.largeur = this.taille;
        
    this.obj = [];
        
    this.createObj = function(xPos, yPos, taille, num, type){
        var objType = type || "Rect";
        var name = "";
        var xy = numTile(num, this.tile.width, taille, taille);
               
        var x = xy.x;
        var y = xy.y;
        
        for(var id in objType)
            for(var i = 0; i < objType[id].length; i++)
                    if(objType[id][i] == num)
                        name = id;
        
        if(num != -1)
            {
                this.obj.push(new Rect(xPos, yPos, this.hauteur, this.largeur, "NULL", false, this.tile, true, x, y, taille, taille));
                this.obj[this.obj.length - 1].id = name;
            }
        else{
            this.obj.push(new Rect(xPos, yPos, this.hauteur, this.largeur, "rgba(0, 0, 0, 0)"));
            this.obj[this.obj.length - 1].id = "vide";
        }
        
    };
        
    this.draw = function(view){
        var view = view || {exist: false};
        for(var i = 0; i < this.obj.length; i++)
        {
            this.obj[i].draw(view);
        }
    };
    
    this.boundingId = function(){
        
    };
    
    this.getObjById = function(id){
        for(var i = 0; i < this.obj.length; i++)
            {
                if(id == this.obj[i].id)
                    return this.obj[i];
            }
    };
    
    this.createLayer = function(terrain, type){
        for(var i = 0; i < terrain.length; i++)
            {   
                var y = i * this.hauteur;
                for(var j = 0; j < terrain[i].length; j++){
                    this.createObj(j * this.largeur, y, this.taille, terrain[j][i], type);
                }
            }
    };
}

function TileMap(path, xhr, hauteur, largeur){
    this.loadingDone = false;
    this.path = path;
    this.layer = [];
    this.xhr = xhr;
    this.image = new Image();
    
    this.hauteur = hauteur || -1;
    this.largeur = largeur || -1;
    
    this.parse = function(){
        this.xhr.open("GET", this.path, false);    //merci encore sdz :P
        this.xhr.send(null);
        if(this.xhr.readyState != 4 || (this.xhr.status != 200 && this.xhr.status != 0)) // Code == 0 en local
            throw new Error("Impossible de charger la carte nommée \"" + nom + "\" (code HTTP : " + xhr.status + ").");
        var mapJsonData = this.xhr.responseText;
        
        var mapData = JSON.parse(mapJsonData);
        
        var nbLayer = mapData.nbLayer;
        var taille = mapData.taille;
        var tileset = mapData.tileset;
        var terrain = mapData.map;
        var exception = mapData.exception;
        
        
        this.image.obj = this;
        
        this.image.onload = function(){
            for(var i = 0; i < nbLayer; i++)
            {
                this.obj.layer.push(new Layer(taille, this, this.obj.hauteur, this.obj.largeur));
                this.obj.layer[i].createLayer(terrain[i], exception);
                this.obj.loadingDone = true;
            }
        };
        
        //this.image.addEventListener('load', this.start(this.layer, this.image, this.context, this.hauteur, this.largeur));
        this.image.src = tileset;
    };
    
    this.retLayer = function(nb){
        return this.layer[nb];
    }
    
    this.draw = function(view){
        var view = view || {exist: false};
        for(var i = 0; i < this.layer.length; i++)
            {
                this.layer[i].draw(view);
            }
    };
    
}



if (typeof exports !== 'undefined')
    {
        exports.Rect = Rect;
        exports.Cercle = Cercle;
        exports.TileMap = TileMap;
    }


