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


function point(x, y)
{
    this.x = x;
    this.y = y;
}

function vector(Ax, Ay, Bx, By){
    this.x = Bx - Ax;
    this.y = By - Ay;
}

function Graph(context, color){
    this.context = context;
    this.color = color;
    
    this.clear = function(){
        this.context.fillStyle =  color;
        this.context.fillRect(0, 0, 100000, 100000);
    };
}

function View(x, y, hauteur, largeur, largIntern, hautIntern, xMap, yMap){ //Intern = echelle
    this.exist = true;
    this.x = x;
    this.y = y;
    this.largeur = largeur;
    this.hauteur = hauteur;
    this.largIntern = largIntern;
    this.hautIntern = hautIntern;
    this.xMap = xMap;
    this.yMap = yMap;
    
    this.draw = function(context){
        context.strokeStyle = 'black';
        context.strokeRect(this.x, this.y, this.largeur, this.hauteur);  
    };
    
    this.move = function(x, y){
        this.x += x;
        this.y += y;
    };
    this.moveView = function(x, y){
        this.xMap += x;
        this.yMap += y;
    };
}

function Rect(x, y, hauteur, largeur, /*margin,*/ context, color, stroke, texture, tile, tileX, tileY, tileLarg, tileHaut) {
    
    this.type = "Rect";
    this.boundingType = "Rect";
    this.id = "Rect";
    
    this.x = x;
    this.y = y;
    this.hauteur = hauteur;
    this.hauteurView = 0;
    this.largeur = largeur;
    this.largeurView = 0;
    this.isDraw = true;
    
    this.margin = 0;
    //this.margin = margin; // a faire
    
    this.context = context;
    this.color = color;
    this.stroke = stroke || false;
    
    this.tile = tile || false;
    
    this.texture = texture;
    this.textureSrc = texture || "yop";
    
    
    this.tileX = tileX || 0;
    this.tileY = tileY || 0;
    this.tileLarg = tileLarg || 0;
    this.tileHaut = tileHaut || 0;
    this.tileLargView = 0;
    
    this.getCoordView = function(view){
        return {x: this.x - view.xMap, y: this.y - view.yMap};
    };
    
    this.draw = function (view) {
        var view = view || {exist: false};
        var relativCoord = this.getCoordView(view);

        if(view.exist){
            if(relativCoord.x + this.largeur > view.largeur && relativCoord.x <= view.largeur)
            {
                this.largeurView = -(view.largeur - relativCoord.x - this.largeur) 
                this.tileLargView = ( this.tileLarg - (-(view.largeur - relativCoord.x - this.tileLarg)) ) / (this.largeur / this.tileLarg);
            }
            else if(relativCoord.x > view.largeur)
                this.isDraw = false;
            else{
                this.largeurView = 0;
                this.tileLargView = this.tileLarg;
            }
        }

        if(this.isDraw == true){
        if (!this.stroke) {
                if (this.textureSrc == "yop")
                    {
                        this.context.fillStyle = this.color;
                        this.context.fillRect(this.x + view.x - view.xMap, this.y + view.y - view.yMap, this.largeur - this.largeurView, this.hauteur);
                    }
                else{
                    if(!view.exist){
                        if(!tile)
                            this.context.drawImage(this.texture, this.x, this.y, this.largeur, this.hauteur);
                        else{
                            this.context.drawImage(this.texture, this.tileX, this.tileY, this.tileLarg, this.tileHaut, this.x + view.x, this.y, this.largeur - this.largeurView, this.hauteur);
                        }
                    }
                    else{
                        this.context.drawImage(this.texture, this.tileX, this.tileY, this.tileLargView, this.tileHaut, this.x + view.x - view.xMap, this.y + view.y - view.yMap, this.largeur - this.largeurView, this.hauteur);
                    }
                }
            }
        else{
            this.context.strokeStyle = this.color;
            this.context.strokeRect(this.x + view.x - view.xMap, this.y + view.y - view.yMap, this.largeur - this.largeurView, this.hauteur);
        }
        }
        this.isDraw = true;
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
    
}

function AnimSet(sprite, num1, num2, tileLarg, tileHaut, time){
    this.sprite = sprite;
    this.num1 = num1;
    this.num2 = num2;
    this.num = {Value:  this.num1};
    
    this.animStop = true;
    
    this.time = [];
    for(var i = num1; i < num2 + 1; i++)
        this.time.push(time);

    
    this.tileLarg = tileLarg;
    this.tileHaut = tileHaut;
    
    
    this.anim = function(obj){
        var xy = numTile(obj.num.Value, obj.sprite.texture.width, obj.tileLarg, obj.tileHaut);
        var x = xy.x;
        var y = xy.y;
        
        obj.sprite.tileLarg = obj.tileLarg;
        obj.sprite.tileHaut = obj.tileHaut;
        obj.sprite.tileX = x;
        obj.sprite.tileY = y;
        if(!obj.animStop){
            //console.log('num: ' + obj.num.Value + '  time: ' +  obj.time[obj.num.Value]);
        
            if(obj.num.Value + obj.num1 < obj.num2)
                obj.num.Value++;
            else
                obj.num.Value = obj.num1;
            setTimeout(obj.anim, obj.time[obj.num.Value], obj);
        }
    };
}

function AnimSprite(x, y, hauteur, largeur, context, tile, tileHaut, tileLarg, objectType){
    this.x = x;
    this.y = y;
    this.hauteur = hauteur;
    this.largeur = largeur;
    this.context = context;
    this.tile = tile;
    this.tileLarg = tileLarg;
    this.tileHaut = tileHaut;
    this.objectType = objectType || "Rect";
    
    this.globalTime = 100;
    this.animLs = {};
    this.currentAnim = {Value: "NULL"};
    
    if(this.objectType == "Rect")
        this.sprite = new Rect(this.x, this.y, this.hauteur, this.largeur, this.context, "black", false, this.tile, true);

    
    this.startAnim = function(){
        if(this.animLs[this.currentAnim.Value].animStop != false){
            this.animLs[this.currentAnim.Value].animStop = false;
            this.animLs[this.currentAnim.Value].anim(this.animLs[this.currentAnim.Value]);
        }
    };
    
    this.stopAnim = function(){
        this.animLs[this.currentAnim.Value].animStop = true;
    };
    
    this.setFrame = function(nb){
        this.animLs[this.currentAnim.Value].num.Value = nb;
    }
    
    this.addAnim = function(name, num1, num2, time){
        this.animLs[name] = new AnimSet(this.sprite, num1, num2, this.tileLarg, this.tileHaut, time);
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
    
    this.addAnim("NULL", 0, 0, 1000);
    //this.interv = setInterval(this.animWhile, this.globalTime, this.animLs, this.currentAnim);
    
}


function Layer(taille, tileset, context, hauteur, largeur){ //tile = image
    this.taille = taille;
    this.tile = tileset;
    this.context = context;
    this.hauteur = hauteur;
    this.largeur = largeur;
    
    if(this.hauteur == -1)
        this.hauteur = this.taille;
    if(this.largeur == -1)
        this.largeur = this.taille;
        
    this.obj = [];
        
    this.createObj = function(xPos, yPos, taille, num, type){
        var objType = type || "Rect";
        
        var xy = numTile(num, this.tile.width, taille, taille);
               
        var x = xy.x;
        var y = xy.y;
        
        if(num != -1)
            {
                this.obj.push(new Rect(xPos, yPos, this.hauteur, this.largeur, this.context, "NULL", false, this.tile, true, x, y, taille, taille));
                this.obj[this.obj.length - 1].id = objType;
            }
        else{
            this.obj.push(new Rect(xPos, yPos, this.hauteur, this.largeur, this.context, "rgba(0, 0, 0, 0)"));
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
    
    this.createLayer = function(terrain){
        for(var i = 0; i < terrain.length; i++)
            {   
                var y = i * this.hauteur;
                for(var j = 0; j < terrain[i].length; j++){
                    this.createObj(j * this.largeur, y, this.taille, terrain[j][i]);
                }
            }
    };
}

function TileMap(path, xhr, context, hauteur, largeur){
    this.path = path;
    this.layer = [];
    this.xhr = xhr;
    this.context = context;
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
        
        this.image.obj = this;
        
        this.image.onload = function(){
            for(var i = 0; i < nbLayer; i++)
            {
                this.obj.layer.push(new Layer(taille, this, this.obj.context, this.obj.hauteur, this.obj.largeur));
                this.obj.layer[i].createLayer(terrain[i]);
            }
        };
        
        //this.image.addEventListener('load', this.start(this.layer, this.image, this.context, this.hauteur, this.largeur));
        this.image.src = tileset;
    };
    
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


