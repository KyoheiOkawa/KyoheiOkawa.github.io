enchant();

window.onload = function(){
    game = new Core(640, 480);
    moveStageToCenter(game);
    game.fps = 60;

    game.rootScene.backgroundColor = "#ffff00";

    game.preload(IMAGE_WHITESHEEP);
    game.preload(IMAGE_BLACKSHEEP);
    game.preload(IMAGE_BLACKFENCE);
    game.preload(IMAGE_WHITEFENCE);
    game.preload(IMAGE_BACKGROUND);
    game.preload(IMAGE_SPECIAL);

    game.onload = function(){
        titleScene = new TitleScene();
        game.replaceScene(titleScene);
    };
    game.start();
};