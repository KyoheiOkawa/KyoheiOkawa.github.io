var ResultPanel = enchant.Class.create(enchant.Sprite,{
	initialize: function(){
		enchant.Sprite.call(this,640,480);

        this.image = game.assets[IMAGE_RESULT_PANEL];
        this.x = 0;
        this.y = -380;
        this.scaleX = 1;
        this.scaleY = 1;
        this.originX = 180.0;
        this.originY = 190.0;
        this.tl.moveTo(0,0,90,enchant.Easing.BOUNCE_EASEOUT);

        this.isShowUI = false;

        this.startFrame = game.frame;
        this.addEventListener('enterframe',function(){
        	var time = (game.frame-this.startFrame)/game.fps;
        	if(time > 0.5){
        		if(!this.isShowUI){
        			this.isShowUI = true;

        			var score = mainScene.score;
        			if(score <= 0)
        				score = "0";

                	        var scoreLb = new Label(score);
        			scoreLb.x = (game.width / 2.0)-(scoreLb.width / 2.0);
        			scoreLb.y = (game.height / 2.0)-(scoreLb.height / 2.0)-28.0;
        			scoreLb.color = '#000000';
        			scoreLb.font = '54px nikumaru';
        			scoreLb.textAlign = 'center';
        			scoreLb.opacity = 0;
        			scoreLb.tl.delay(90).fadeIn(30);
        			mainScene.addChild(scoreLb);

                                var awardStr = "";
                                for(var i = AWARD_COMMENTS.length-1; i >= 0; i--)
                                {
                                        if(score >= AWARD_COMMENTS[i][0])
                                        {
                                                awardStr = AWARD_COMMENTS[i][1];
                                                break;
                                        }
                                }

                                var awardLb = new Label(awardStr);
                                awardLb.x = (game.width / 2.0) - (awardLb.width / 2.0);
                                awardLb.y = (game.height / 2.0) - (awardLb.height /  2.0);
                                awardLb.opacity = 0;
                                awardLb.scaleX = 4;
                                awardLb.scaleY = 4;
                                awardLb.color = '#000000';
                                awardLb.font = '23px nikumaru';
                                awardLb.textAlign = 'center';
                                awardLb.tl.delay(150).fadeIn(15).moveTo((game.width / 2.0)-(awardLb.width / 2.0),(game.height / 2.0)-(awardLb.height / 2.0)+105.0,15).and().scaleTo(1,15);
                                mainScene.addChild(awardLb);

                                rankHtml = new Entity();
                                rankHtml._element = document.createElement('div'); 
                                rankHtml._element.innerHTML = '<iframe id="rank" src="rank.html" width="300" height="400" frameborder="0"></iframe>';
                                rankHtml.width = 300;
                                rankHtml.height = 400;
                                rankHtml._isShow = false;
                                rankHtml.x = (game.width / 2.0)-(rankHtml.width/2.0);
                                rankHtml.y = (game.height / 2.0)-(rankHtml.height/2.0)-25.0;

                                var startBt = new Sprite(128,64);
                                startBt.x = startBt.width * 0.25;
                                startBt.y = game.height - startBt.height*1.25;
                                startBt.image = game.assets[IMAGE_START_BT];
                                mainScene.addChild(startBt);

                                startBt.addEventListener('touchstart',function(e){
                                        this.scaleX = 1.25;
                                        this.scaleY = 1.25;
                                });

                                startBt.addEventListener('touchmove',function(e){
                                        if(!isPointInnerRect(e.x,e.y,this.x,this.y,this.width,this.height)){
                                                this.scaleX = 1.0;
                                                this.scaleY = 1.0;
                                        }
                                });

                                startBt.addEventListener('touchend',function(e){
                                        if(isPointInnerRect(e.x,e.y,this.x,this.y,this.width,this.height)){
                                                mainScene = new MainScene();
                                                game.replaceScene(mainScene);
                                        }
                                        else{
                                                this.scaleX = 1.0;
                                                this.scaleY = 1.0;
                                        }
                                });

                                var rankBt = new Sprite(128,64);
                                rankBt.x = game.width - rankBt.width * 1.25;
                                rankBt.y = game.height - rankBt.height*1.25;
                                rankBt.image = game.assets[IMAGE_RANK_BT];
                                mainScene.addChild(rankBt);


                                rankBt.addEventListener('touchstart',function(e){
                                        this.scaleX = 1.25;
                                        this.scaleY = 1.25;
                                });

                                rankBt.addEventListener('touchmove',function(e){
                                        if(!isPointInnerRect(e.x,e.y,this.x,this.y,this.width,this.height)){
                                                this.scaleX = 1.0;
                                                this.scaleY = 1.0;
                                        }
                                });

                                rankBt.addEventListener('touchend',function(e){
                                        if(isPointInnerRect(e.x,e.y,this.x,this.y,this.width,this.height)){
                                                if(!rankHtml._isShow){
                                                        rankHtml._isShow = true;
                                                        rankBt.image = game.assets[IMAGE_RANK_BT_DISABLE];
                                                        mainScene.addChild(rankHtml);
                                                }
                                                else{
                                                        rankHtml._isShow = false;
                                                        rankBt.image = game.assets[IMAGE_RANK_BT];
                                                        mainScene.removeChild(rankHtml);
                                                }

                                        }

                                        this.scaleX = 1.0;
                                        this.scaleY = 1.0;
                                });
        		}
        	}
        });
	}
});