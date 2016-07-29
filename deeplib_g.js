function Graph(context, color){
    this.context = context;
    this.color = color;
    
    this.clear = function(){
        this.context.fillStyle =  color;
        this.context.fillRect(0, 0, 100000, 100000);
    };
}

function Rect(x, y, hauteur, largeur, margin, context, color, stroke, texture) {
    
    this.type = "Rect";
    this.boundingType = "Rect";
    
    this.x = x;
    this.y = y;
    this.hauteur = hauteur;
    this.largeur = largeur;
    this.margin = margin;
    
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
    this.boundingPoint = function (x, y, cotdgF, cothbF) {
        var cotdg = cotdgF || 0;
        var cothb = cothbF || 0;
        if( ( ( x <= (this.x + this.largeur + this.margin + cotdg) ) && ( x >= this.x - this.margin - cotdg) ) && ( ( y <= (this.y + this.hauteur + this.margin + cothb) ) && ( y >= this.y - this.margin - cothb) ) )
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
                  if(object.x >= this.x + this.largeur + this.margin + cotD
                     || object.x + object.largeur <= this.x - this.margin - cotG
                     || object.y >= this.y + this.hauteur + this.margin + cotB
                     || object.y + object.hauteur <= this.y - this.margin - cotH)
                      return false;
                  else 
                      return true;
              }
    };
}

function Sph(){
    
}

if (typeof exports !== 'undefined')
    {
        exports.Rect = Rect;
        exports.Sph = Sph;
    }


