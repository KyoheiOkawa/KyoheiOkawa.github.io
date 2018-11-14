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
        			scoreLb.y = (game.height / 2.0)-(scoreLb.height / 2.0)-32.0;
        			scoreLb.color = '#000000';
        			scoreLb.font = '64px nikumaru';
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
                                awardLb.x = (game.width / 2.0)-(awardLb.width / 2.0);
                                awardLb.y = (game.height / 2.0)-(awardLb.height / 2.0)+105.0;
                                awardLb.opacity = 0;
                                awardLb.scaleX = 3;
                                awardLb.scaleY = 3;
                                awardLb.color = '#000000';
                                awardLb.font = '23px nikumaru';
                                awardLb.textAlign = 'center';
                                awardLb.tl.delay(150).fadeIn(15).scaleTo(1,15);
                                mainScene.addChild(awardLb);

                                mainScene.addEventListener('touchstart',function(e){
                                        mainScene = new MainScene();
                                        game.replaceScene(mainScene);
                                });
        		}
        	}
        });
	}
});