enchant();

window.onload = function(){
    game = new Core(640, 480);
    moveStageToCenter(game);
    game.fps = 60;

    game.rootScene.backgroundColor = "#ffff00";

    game.preload(IMAGE_WHITESHEEP);
    game.preload(IMAGE_BLACKSHEEP);
    game.preload(IMAGE_SWHITESHEEP);
    game.preload(IMAGE_SBLACKSHEEP);
    game.preload(IMAGE_BLACKFENCE);
    game.preload(IMAGE_WHITEFENCE);
    game.preload(IMAGE_BACKGROUND);
    game.preload(IMAGE_SPECIAL);
    game.preload(IMAGE_READY);
    game.preload(IMAGE_GO);
    game.preload(IMAGE_TIMEOVER);
    game.preload(IMAGE_RESULT_PANEL);
    game.preload(IMAGE_TIME_FRAME);
    game.preload(IMAGE_SCORE_FRAME);
    game.preload(IMAGE_START_BT);
    game.preload(IMAGE_RANK_BT);
    game.preload(IMAGE_RANK_BT_DISABLE);
    game.preload(IMAGE_SUCCESS);
    game.preload(IMAGE_FAIL);

    game.preload(SOUND_POINT);
    game.preload(SOUND_SHEEP);
    game.preload(SOUND_MISS);
    game.preload(SOUND_BGM);

    game.onload = function(){
        game.bgm = game.assets[SOUND_BGM].clone();
        game.bgm.isPlay = false;

        titleScene = new TitleScene();
        game.replaceScene(titleScene);
    };

    game.start();
};