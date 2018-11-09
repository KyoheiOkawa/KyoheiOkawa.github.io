var ResultScene = enchant.Class.create(enchant.Scene,{
	initialize: function(score){
		enchant.Scene.call(this);

		var startLabel = new Label("スコア:"+score);
        startLabel.x = (game.width / 2.0)-(startLabel.width/2.0);
        startLabel.y = (game.height/ 2.0)-16.0;
        startLabel.color = '#FF0000';
        startLabel.font = 'bold 32px nikumaru';
        startLabel.textAlign = 'center';
        this.addChild(startLabel);

        this.addEventListener("touchend",function(e){
			titleScene = new TitleScene();
			game.replaceScene(titleScene);
		});
	}
});