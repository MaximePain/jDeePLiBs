var collisionRectRect = function(A, B, cotG, cotD, cotH, cotB){
    var cotG = cotG || 0;
    var cotD = cotD || 0;
    var cotH = cotH || 0;
    var cotB = cotB || 0;
    if(B.x - B.margin >= A.x + A.largeur + A.margin + cotD
       || B.x + B.largeur + B.margin <= A.x - A.margin - cotG
       || B.y - B.margin >= A.y + A.hauteur + A.margin + cotB
       || B.y + B.hauteur + B.margin <= A.y - A.margin - cotH)
        return false;
    else 
        return true;
};

var collisionCerclePoint = function(C, x, y){
    var d2 = (x-C.x)*(x-C.x) + (y-C.y)*(y-C.y);
    if (d2 > C.rayon * C.rayon)
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

var collisionRectCercle = function(R, C, cotG, cotD, cotH, cotB){
    var boxCercle = C.getBox();
    
    if(!collisionRectRect(R, boxCercle))
        return false;
    
    if(C.boundingPoint(R.x - cotG, R.y - cotB)
       || C.boundingPoint(R.x - cotG, R.y + R.hauteur + cotB)
       || C.boundingPoint(R.x + R.largeur + cotD, R.y - cotB)
       || C.boundingPoint(R.x + R.largeur + cotD, R.y + R.hauteur + cotB))
        return true;
    
    if(R.boundingPoint(C.x, C.y))
        return true;
    
    var projvertical = ProjectionSurSegment(C.x, C.y, R.x, R.y, R.x, R.y + R.hauteur);
    var projhorizontal = ProjectionSurSegment(C.x, C.y, R.x, R.y, R.x + R.largeur, R.y); 
    if (projvertical || projhorizontal)
        return true;
    return false;
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

function Rect(x, y, hauteur, largeur, /*margin,*/ context, color, stroke, texture) {
    
    this.type = "Rect";
    this.boundingType = "Rect";
    
    this.x = x;
    this.y = y;
    this.hauteur = hauteur;
    this.largeur = largeur;
    this.margin = 0;
    //this.margin = margin; // a faire
    
    this.context = context;
    this.color = color;
    this.stroke = stroke || false;
    this.texture = new Image();
    this.texture.src = texture || "yop";
    
    this.d2 = 42;
    
    this.draw = function () {
        if (!this.stroke) {
                if (this.texture.src != "yop")
                    {
                        this.context.fillStyle = this.color;
                        this.context.fillRect(this.x, this.y, this.largeur, this.hauteur);
                    }
                else{
                    context.drawImage(this.texture, this.x, this.y, largeur, hauteur);
                }
            }
        else{
            this.context.strokeStyle = this.color;
            this.context.strokeRect(this.x, this.y, this.largeur, this.hauteur);
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
    this.boundingPoint = function (x, y, cotG, cotD, cotH, cotB) {
        var cotG = cotG || 0;
        var cotD = cotD || 0;
        var cotH = cotH || 0;
        var cotB = cotB || 0;
        if( ( ( x <= (this.x + this.largeur + this.margin + cotD) ) && ( x >= this.x - this.margin - cotG) ) && ( ( y <= (this.y + this.hauteur + this.margin + cotH) ) && ( y >= this.y - this.margin - cotB) ) )
            return true;
        else
            return false; 
    };
    this.boundingObj = function (object, cotG, cotD, cotH, cotB) {
        var cotG = cotG || 0;
        var cotD = cotD || 0;
        var cotH = cotH || 0;
        var cotB = cotB || 0;
        if(object.boundingType == "Rect")
        {
            return collisionRectRect(this, object, cotG, cotD, cotH, cotB);
        }
        else if(object.boundingType == "Cercle"){
            return collisionRectCercle(this, object, cotG, cotD, cotH, cotB);
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
    this.texture.src = texture || "yop";
    
    this.draw = function () {
        if (!this.stroke) {
                if (this.texture.src != "yop")
                    {
                        this.context.fillStyle = this.color;
                        this.context.beginPath(); // La bouche, un arc de cercle
                        this.context.arc(this.x, this.y, this.rayon, 0, Math.PI * 2);
                        this.context.fill();
                    }
                else{
                    context.drawImage(this.texture, this.x, this.y, largeur, hauteur);
                }
            }
        else{
            this.context.strokeStyle = this.color;
            this.context.beginPath(); // La bouche, un arc de cercle
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
    this.boundingObj = function(object, cotG, cotD, cotH, cotB){
        
    };
    
}

if (typeof exports !== 'undefined')
    {
        exports.Rect = Rect;
        exports.Cercle = Cercle;
    }


