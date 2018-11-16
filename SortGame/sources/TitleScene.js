var TitleScene = enchant.Class.create(enchant.Scene,{
	initialize: function(){
	enchant.Scene.call(this);

	var startLabel = new Label("スタートボタンを押して");
        startLabel.x = (game.width / 2.0)-(startLabel.width/2.0);
        startLabel.y = (game.height/ 2.0)-16.0;
        startLabel.color = '#FF0000';
        startLabel.font = 'bold 20px nikumaru';
        startLabel.textAlign = 'center';
        this.addChild(startLabel);

		var startBt = new Sprite(128,64);
        startBt.x = (game.width / 2.0)-startBt.width*0.5;
        startBt.y = game.height - startBt.height*1.25;
        startBt.image = game.assets[IMAGE_START_BT];
        this.addChild(startBt);

        userHtml = new Entity();
        userHtml._element = document.createElement('div'); 
        userHtml._element.innerHTML = '<iframe src="user.html" width="640" height="380" frameborder="0"></iframe>';
        userHtml.width = 200;
        userHtml._isShow = false;
        this.addChild(userHtml);

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
	}
});