function Rect(x, y, hauteur, largeur, context, color, stroke, texture) {
    "use strict";
    this.type = "Rect";
    this.boundingType = "Rect";
    
    this.x = x;
    this.y = y;
    this.hauteur = hauteur;
    this.largeur = largeur;
    this.margin = 0;
    
    this.context = context;
    this.color = color;
    this.stroke = stroke || false;
    this.texture = new Image();
    this.texture.src = texture || "NULL";
    
    this.draw = function () {
        if (!this.stroke) {
                if (this.texture.src == "NULL")
                    {
                        this.context.fillStyle = this.color;
                        this.context.fillRect(this.x, this.y, this.largeur, this.hauteur);
                    }
                else{
                    context.drawImage(this.texture, this.x, this.y);
                }
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
        if( ( ( x <= (this.x + this.largeur) ) && ( x >= this.x ) ) && ( ( y <= (this.y + this.hauteur) ) && ( y >= this.y ) ) )
            return true;
        else
            return false; 
    };
    this.boundingObj = function (object) {
          if(object.boundingType == "Rect")
              {
                  if(object.x >= this.x + this.largeur
                     || object.x + object.largeur <= this.x
                     || object.y >= this.y + this.hauteur
                     || object.y + object.hauteur <= this.y)
                      return false;
                  else 
                      return true;
              }
    };
}