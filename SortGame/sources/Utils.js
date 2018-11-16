var moveStageToCenter = function(core) {
 var stagePos = {
  top: (window.innerHeight - (core.height * core.scale)) / 2,
  left: (window.innerWidth - (core.width * core.scale)) / 2,
 };
 var stage = document.getElementById('enchant-stage');
 stage.style.position = 'absolute';
 stage.style.top = stagePos.top + 'px';
 stage.style.left = stagePos.left + 'px';
 core._pageX = stagePos.left;
 core._pageY = stagePos.top;
};

var createRandomDir = function(vec2){
    var sign = 1.0;

    if(Math.random() > 0.5)
        sign = -1.0;
    else
        sign = 1.0;
    vec2[0] = Math.random()*sign;


    if(Math.random() > 0.5)
        sign = -1.0;
    else
        sign = 1.0;
    vec2[1] = (1.0 - Math.abs(vec2[0]))*sign;
}

var checkOutOfWindow = function(pos,imageHeight,imageWidth){
    if(pos[1] < -imageHeight)
        return true;

    if(pos[1] > game.height)
        return true;

    if(pos[0] < -imageWidth)
        return true;

    if(pos[0] > game.width)
        return true;


    return false;
}

var isPointInnerRect = function(px,py,rx,ry,rwidth,rheight){
    var isX = false;
    var isY = false;

    if(px >= rx && px <= rx+rwidth)
        isX = true;

    if(py >= ry && py <= ry+rheight)
        isY = true;

    return isX && isY;
}