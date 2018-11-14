var Sheep = enchant.Class.create(enchant.Sprite,{
    initialize: function(vx,vy,type,isSpecial){
        enchant.Sprite.call(this,SHEEP_IMAGE_SIZE,SHEEP_IMAGE_SIZE);

        if(type == "Black")
        {
            if(!isSpecial)
                this.image = game.assets[IMAGE_BLACKSHEEP];
            else
                this.image = game.assets[IMAGE_SBLACKSHEEP];
        }
        else if(type == "White")
        {
            if(!isSpecial)
                this.image = game.assets[IMAGE_WHITESHEEP];
            else
                this.image = game.assets[IMAGE_SWHITESHEEP];
        }

        this.type = type;
        this.isSpecial = isSpecial;

        this.x = vx;
        this.y = vy;

        var scale = MIN_SHEEP_SCALE + Math.random() * (MAX_SHEEP_SCALE-MIN_SHEEP_SCALE);

        this.scaleX = scale;
        this.scaleY = scale;

        this.moveDir = [0,0];
        if(!isSpecial)
        {
            createRandomDir(this.moveDir);
        }
        if(this.moveDir[0]>0)
            this.scaleX = -Math.abs(this.scaleX);

        this.speed = 1.0;
        this.isTouched = false;

        this.addEventListener('enterframe',function(e){
            if(!this.isTouched){
                if(this.isSpecial)
                    this.specialMove();
                else
                    this.moveRondom();
            }

            if(this.isSpecial)
            {
                //画面外に出てたら削除
                if(checkOutOfWindow([this.x,this.y],SHEEP_IMAGE_SIZE*this.scaleY,SHEEP_IMAGE_SIZE*this.scaleY)){
                    sheeps.some(function(v,i){
                    if(v==this)
                        sheeps.splice(i,1);
                    });

                    stageObjGroup.removeChild(this);
                }
            }
        });
    },
    moveRondom: function(){
        this.x += this.moveDir[0]*this.speed;
        this.y += this.moveDir[1]*this.speed;

        //画面右端に行ったら左に動く
        if(this.x > game.width - this.width){
            this.moveDir[0] *= -1.0;
            this.x = game.width - this.width;
        }
        //画面左端に行ったら右に動く
        if(this.x < 0){
            this.moveDir[0] *= -1.0;
            this.x = 0;
        }
        //動く方向によってスプライトの向きを変更
        if(this.moveDir[0]>0)
             this.scaleX = -Math.abs(this.scaleX);
        else if(this.moveDir[0]<0)
            this.scaleX = Math.abs(this.scaleX);


         //画面上端に行ったら下に動く
        if(this.y < 0){
             this.moveDir[1] *= -1.0;
            this.y = 0;
        }
            //画面下端に行ったら上に動く
        if(this.y > game.height - this.height){
            this.moveDir[1] *= -1.0;
            this.y = game.height - this.height;
        }

        for(var i = 0; i < fences.length; i++){
            //フェンスとぶつかったら
            if(this.intersect(fences[i])){
                var dx = fences[i].x - this.x;
                var dy = fences[i].y - this.y;

                if(dx * this.moveDir[0] > 0)
                    this.moveDir[0] *= -1.0;

                if(dy * this.moveDir[1] > 0)
                    this.moveDir[1] *= -1.0;
            }
        }
    },
    specialMove: function(){
        var befX = this.x;
        var befY = this.y;

        this.x += this.moveDir[0]*this.speed;
        this.y += this.moveDir[1]*this.speed;

        for(var i = 0; i < fences.length; i++){
            //フェンスとぶつかったら
            if(this.intersect(fences[i])){
                this.x = befX;
                this.y = befY;

                var dirx = this.moveDir[0];
                var diry = this.moveDir[1];

                this.moveDir[0] = Math.abs(diry);
                this.moveDir[1] = Math.abs(dirx);

                //一番近いところから枠外に出るようにする
                if(this.y < game.height / 2.0)
                    this.moveDir[1] *= -1.0;

                if(this.x < game.width / 2.0)
                    this.moveDir[0] *= -1.0;
            }
        }
    }
});