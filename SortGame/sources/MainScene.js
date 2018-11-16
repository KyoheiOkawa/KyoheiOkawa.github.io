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

        scoreFrame = new Sprite(156,40);
        scoreFrame.x = game.width-156;
        scoreFrame.y = 135;
        scoreFrame.image = game.assets[IMAGE_SCORE_FRAME];
        uiGroup.addChild(scoreFrame);

        var scoreLabel = new Label(this.score);
        scoreLabel.x = scoreFrame.x-65;
        scoreLabel.y = scoreFrame.y+10;
        scoreLabel.color = '#000000';
        scoreLabel.font = '20px nikumaru';
        scoreLabel.textAlign = 'center';
        uiGroup.addChild(scoreLabel);
        scoreLabel.addEventListener(enchant.Event.ENTER_FRAME,function(){
            this.text = mainScene.score;
        });

        successSp = new Sprite(32,32);
        successSp.x = scoreFrame.x+30.0;
        successSp.y = scoreFrame.y+6.0;
        successSp.opacity = 0;
        successSp.image = game.assets[IMAGE_SUCCESS];
        uiGroup.addChild(successSp);

        failSp = new Sprite(32,32);
        failSp.x = scoreFrame.x+30.0;
        failSp.y = scoreFrame.y+6.0;
        failSp.opacity = 0;
        failSp.image = game.assets[IMAGE_FAIL];
        uiGroup.addChild(failSp);

        var timeFrame = new Sprite(156,40);
        timeFrame.x = 0;
        timeFrame.y = 135;
        timeFrame.image = game.assets[IMAGE_TIME_FRAME];
        uiGroup.addChild(timeFrame);

        var timeLabel = new Label(this.limitTime);
        timeLabel.x = -49;
        timeLabel.y = timeFrame.y+10;
        timeLabel.color = '#000000';
        timeLabel.font = '20px nikumaru';
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
                endLabel = new Sprite(320,120);
                endLabel.image = game.assets[IMAGE_TIMEOVER];
                endLabel.x = (game.width / 2.0)-(endLabel.width/2.0);
                endLabel.y = (game.height/ 2.0)-(endLabel.height/2.0);
                endLabel.scaleX = 4;
                endLabel.scaleY = 4;
                endLabel.opacity = 0;
                endLabel.tl.fadeIn(10).scaleTo(1,30);
                uiGroup.addChild(endLabel);

                endLabel.isShowResultPanel = false;

                endLabel.startFrame = game.frame;
                endLabel.addEventListener(enchant.Event.ENTER_FRAME,function(){
                    if((game.frame-this.startFrame)/game.fps > GAME_END_INTERVAL+0.5){

                        if(!this.isShowResultPanel){
                            mainScene.removeChild(uiGroup);
                            this.isShowResultPanel = true;
                            var resultPanel = new ResultPanel();
                            mainScene.addChild(resultPanel);
                        }
                    }
                });
            }

            this.text = mainScene.time; 
        });

        startLabel = new Sprite(320,120);
        startLabel.image = game.assets[IMAGE_READY];
        startLabel.x = (game.width / 2.0)-(startLabel.width/2.0);
        startLabel.y = (game.height/ 2.0)-(startLabel.height/2.0);
        startLabel.scaleX = 0;
        startLabel.scaleY = 0;
        startLabel.tl.scaleTo(1,40,enchant.Easing.QUAD_EASEIN);
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

        this.addEventListener("enterframe",function(e){

        });

        var isTouch = false;
        touchedSheep = null;
        function drag(e){
            if(touchedSheep==null)
                return;

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

                    var se = game.assets[SOUND_SHEEP].clone();
                    se.play();
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

                if(time>GAME_START_INTERVAL)
                {
                    startLabel.image = game.assets[IMAGE_GO];
                    startLabel.tl.delay(15).fadeOut(30);
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
        if(!touchedSheep.isSpecial)
            this.respawn();

        sheeps.some(function(v,i){
        if(v==touchedSheep)
                sheeps.splice(i,1);
        });

        stageObjGroup.removeChild(touchedSheep);

        // if(touchedSheep.isSpecial)
        //     stageObjGroup.removeChild(touchedSheep.specialImage);

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

                    successSp.opacity = 1;
                    successSp.x = scoreFrame.x+30.0;
                    successSp.y = scoreFrame.y+5.0;
                    successSp.tl.clear();
                    successSp.tl.moveBy(0,-20,30).and().fadeOut(40);

                    var pointSe = game.assets[SOUND_POINT].clone();
                    pointSe.play();
                }
                else{
                    this.score -= MINUS_POINT;
                    if(this.score < 0)
                        this.score = 0;

                    failSp.opacity = 1;
                    failSp.scaleX = 0;
                    failSp.x = scoreFrame.x+30.0;
                    failSp.y = scoreFrame.y+5.0;
                    failSp.tl.clear();
                    failSp.tl.scaleTo(1,1,20).fadeOut(15);

                    var missSe = game.assets[SOUND_MISS].clone();
                    missSe.play();
                }

                this.removeTouchedSheep();

                return;
            }
        }

        touchedSheep = null;
    },
    respawn:function(){
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
        var r = Math.random();
        var color;
        if(r > 0.5)
            color = "Black";
        else
            color = "White";

        var index = Math.floor(Math.random()*(RESPAWN_POINT.length-1));
        var pointIndex = RESPAWN_POINT[index];

        var sheep = new Sheep(pointIndex[0],pointIndex[1],color,true);
        var dirs = [
            [1,0],
            [-1,0],
            [0,1],
            [0,-1]
        ];
        sheep.moveDir = dirs[index];
        if(index==0)
            sheep.scaleX = -sheep.scaleX;

        sheep.speed = this.respawnSheepSpeed;
        stageObjGroup.addChild(sheep);

        // var specialImage = new Sprite(64,64);
        // specialImage.x = sheep.x;
        // specialImage.y = sheep.y;
        // specialImage.image = game.assets[IMAGE_SPECIAL];
        // specialImage.addEventListener(enchant.Event.ENTER_FRAME,function(){
        //     this.x = sheep.x;
        //     this.y = sheep.y;
        // });
        // sheep.specialImage = specialImage;
        // stageObjGroup.addChild(specialImage);

        sheeps.push(sheep);
    }
});