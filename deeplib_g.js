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
    this.boundingPoint = function (x, y) {
        if( ( ( x <= (this.x + this.largeur + this.margin) ) && ( x >= this.x - this.margin) ) && ( ( y <= (this.y + this.hauteur + this.margin) ) && ( y >= this.y - this.margin) ) )
            return true;
        else
            return false; 
    };
    this.boundingObj = function (object) {
          if(object.boundingType == "Rect")
              {
                  if(object.x >= this.x + this.largeur + this.margin
                     || object.x + object.largeur <= this.x - this.margin
                     || object.y >= this.y + this.hauteur + this.margin
                     || object.y + object.hauteur <= this.y - this.margin)
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


