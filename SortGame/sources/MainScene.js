var MainScene = enchant.Class.create(enchant.Scene,{
	initialize: function(){
		enchant.Scene.call(this);

        this.startFrame = game.frame;
        this.time = LIMIT_TIME
        this.score = 0;
        this.gameState = "start";
        this.respawnSheepSpeed = 1.0;
        this.isNow5Sec = false;

        var backGround = new Sprite(690,480);
        backGround.x = 0;
        backGround.y = 0;
        backGround.image = game.assets[IMAGE_BACKGROUND];
        this.addChild(backGround);

        fences = new Array;

        blackFenceA = new Fence(0,0,"Black");
        this.addChild(blackFenceA);
        fences.push(blackFenceA);

        blackFenceB = new Fence(game.width-FENCE_IMAGE_SIZE,game.height-FENCE_IMAGE_SIZE,"Black");
        this.addChild(blackFenceB);
        fences.push(blackFenceB);

        whiteFenceA = new Fence(game.width-FENCE_IMAGE_SIZE,0,"White");
        this.addChild(whiteFenceA);
        fences.push(whiteFenceA);

        whiteFenceB = new Fence(0,game.height-FENCE_IMAGE_SIZE,"White");
        this.addChild(whiteFenceB);
        fences.push(whiteFenceB);

        stageObjGroup = new Group();
        this.addChild(stageObjGroup);

        var uiGroup = new Group();
        this.addChild(uiGroup);

        var scoreLabel = new Label("点数:"+this.score);
        scoreLabel.x = (game.width / 2.0)-(scoreLabel.width / 2.0);
        scoreLabel.y = game.height-42.0;
        scoreLabel.color = '#FFFFFF';
        scoreLabel.font = '32px nikumaru';
        scoreLabel.textAlign = 'center';
        uiGroup.addChild(scoreLabel);
        scoreLabel.addEventListener(enchant.Event.ENTER_FRAME,function(){
            this.text = "点数:" + mainScene.score;
        });

        var timeLabel = new Label("残り時間:"+this.limitTime);
        timeLabel.x = (game.width / 2.0)-(scoreLabel.width / 2.0);
        timeLabel.y = 16.0;
        timeLabel.color = '#FFFFFF';
        timeLabel.font = '32px nikumaru';
        timeLabel.textAlign = 'center';
        uiGroup.addChild(timeLabel);
        timeLabel.addEventListener(enchant.Event.ENTER_FRAME,function(){
            if(mainScene.gameState=="play")
                mainScene.time = LIMIT_TIME - parseInt((game.frame-mainScene.startFrame)/game.fps);
            if(mainScene.time < 0)
                mainScene.time = 0;

            if(mainScene.gameState=="end")
                return;

            if(mainScene.time <= 0){
                mainScene.gameState = "end"
                endLabel = new Label("時間切れ！");
                endLabel.x = (game.width / 2.0)-(startLabel.width/2.0);
                endLabel.y = (game.height/ 2.0)-32.0;
                endLabel.color = '#FF0000';
                endLabel.font = 'bold 54px nikumaru';
                endLabel.textAlign = 'center';
                uiGroup.addChild(endLabel);

                endLabel.startFrame = game.frame;
                endLabel.addEventListener(enchant.Event.ENTER_FRAME,function(){
                    if((game.frame-this.startFrame)/game.fps > GAME_END_INTERVAL){
                        var resultScene = new ResultScene(mainScene.score);
                        game.replaceScene(resultScene);
                    }
                });
            }

            this.text = "残り時間:" + mainScene.time; 
        });

        startLabel = new Label("よーい");
        startLabel.x = (game.width / 2.0)-(startLabel.width/2.0);
        startLabel.y = (game.height/ 2.0)-48.0;
        startLabel.color = '#FF0000';
        startLabel.font = 'bold 96px nikumaru';
        startLabel.textAlign = 'center';
        uiGroup.addChild(startLabel);

        sheeps = new Array();

        for(var i =0; i < 7; i++){
            var animal = new Sheep(240,240,"Black",false);
            stageObjGroup.addChild(animal);
            sheeps.push(animal);

            animal = new Sheep(300,240,"White",false);
            stageObjGroup.addChild(animal);
            sheeps.push(animal);
        }

        var specialSheep = new Sheep(320,240,"Black",true);
        var specialImage = new Sprite(64,64);
        specialImage.image = game.assets[IMAGE_SPECIAL];
        specialImage.addEventListener(enchant.Event.ENTER_FRAME,function(){
            this.x = specialSheep.x;
            this.y = specialSheep.y;
        });
        specialSheep.specialImage = specialImage;
        stageObjGroup.addChild(specialSheep);
        stageObjGroup.addChild(specialImage);
        sheeps.push(specialSheep);

        var isTouch = false;
        touchedSheep = null;
        function drag(e){
            if(touchedSheep==null)
                return;

            // if(!touchedSheep.isTouched)
            // {
            //     this.removeTouchedSheep();
            //     return;
            // }

            //カーソルが枠外に出た時の処理（羊を離す）
            if(e.x<10||e.x>game.width-10||e.y<10||e.y>game.height-10){
                this.removeEventListener("touchmove",drag);
                if(touchedSheep!=null){
                    touchedSheep.isTouched = false;
                    this.judge();
                }
                isTouch = false;
                return;
            }

            touchedSheep.x = e.x - (SHEEP_IMAGE_SIZE/2.0);
            touchedSheep.y = e.y - (SHEEP_IMAGE_SIZE/2.0);
        }
        this.addEventListener("touchstart",function(e){
            if(this.gameState!="play")
                return;

            isTouch = true
            this.addEventListener("touchmove",drag);
            for(var i = sheeps.length-1; i >= 0; i--){
                if(e.x >= sheeps[i].x && e.x <= sheeps[i].x + SHEEP_IMAGE_SIZE*sheeps[i].scaleY &&
                   e.y >= sheeps[i].y && e.y <= sheeps[i].y + SHEEP_IMAGE_SIZE*sheeps[i].scaleY){
                    touchedSheep = sheeps[i];
                    touchedSheep.isTouched = true;
                    break;
                }
            }
        });
        this.addEventListener("touchend",function(e){
            isTouch = false;
            if(touchedSheep!=null){
                touchedSheep.isTouched = false;
                this.judge();
            }
        });

        this.addEventListener("enterframe",function(e){
            if(this.gameState=="start"){
                var time = (game.frame-this.startFrame)/game.fps;
                if(time > 2.5)
                    startLabel.text = "どん";

                if(time>GAME_START_INTERVAL)
                {
                    startLabel.visible = false;
                    this.startFrame = game.frame
                    this.gameState = "play";
                }
            }

            if(this.gameState=="play"){
                //５秒に一回スペシャル羊生成
                if(mainScene.time % 5 == 0){
                    if(!this.isNow5Sec){
                        this.isNow5Sec = true;
                        this.spawnSpecialSheep();
                    }
                }
                else{
                    this.isNow5Sec = false;
                }
            }
        });
	},
    removeTouchedSheep:function(){
        this.respawn();

        sheeps.some(function(v,i){
        if(v==touchedSheep)
                sheeps.splice(i,1);
        });

        stageObjGroup.removeChild(touchedSheep);

        if(touchedSheep.isSpecial)
            stageObjGroup.removeChild(touchedSheep.specialImage);

        touchedSheep = null;
    },
    judge:function(){
        if(touchedSheep==null)
            return;

        for(var i = 0; i < fences.length; i++){
            //ゲージに入った！！
            if(fences[i].intersect(touchedSheep)){
                if(fences[i].type == touchedSheep.type){
                    if(touchedSheep.isSpecial)
                        this.score += SPECIAL_ADD_POINT;
                    else
                        this.score += ADD_POINT;
                }
                else{
                    this.score -= MINUS_POINT;
                    if(this.score < 0)
                        this.score = 0;
                }

                this.removeTouchedSheep();

                return;
            }
        }

        touchedSheep = null;
    },
    respawn:function(){
        if(sheeps.length >= MAX_SHEEP_NUM)
            return;

        var r = Math.random();
        var color;
        if(r > 0.5)
            color = "Black";
        else
            color = "White";

        var point;

        var pointIndex = RESPAWN_POINT[Math.floor(Math.random()*(RESPAWN_POINT.length))];

        if(this.score <= MAX_SPEED_SCORE)
            this.respawnSheepSpeed = MIN_SHEEP_SPEED + (this.score / MAX_SPEED_SCORE)*(MAX_SHEEP_SPEED-MIN_SHEEP_SPEED);
        else
            this.respawnSheepSpeed = MMAX_SHEEP_SPEED;


        var sheep = new Sheep(pointIndex[0],pointIndex[1],color,false);
        sheep.speed = this.respawnSheepSpeed;
        stageObjGroup.addChild(sheep);

        sheeps.push(sheep);
    },
    spawnSpecialSheep:function(){
        if(sheeps.length >= MAX_SHEEP_NUM)
            return;

        var r = Math.random();
        var color;
        if(r > 0.5)
            color = "Black";
        else
            color = "White";

        var sheep = new Sheep(game.width/2.0,game.height/2.0,color,true);
        sheep.speed = this.respawnSheepSpeed;
        stageObjGroup.addChild(sheep);

        var specialImage = new Sprite(64,64);
        specialImage.x = sheep.x;
        specialImage.y = sheep.y;
        specialImage.image = game.assets[IMAGE_SPECIAL];
        specialImage.addEventListener(enchant.Event.ENTER_FRAME,function(){
            this.x = sheep.x;
            this.y = sheep.y;
        });
        sheep.specialImage = specialImage;
        stageObjGroup.addChild(specialImage);

        sheeps.push(sheep);
    }
});