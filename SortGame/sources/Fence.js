var Fence = enchant.Class.create(enchant.Sprite,{
    initialize: function(vx,vy,type){
        enchant.Sprite.call(this,FENCE_IMAGE_SIZE,FENCE_IMAGE_SIZE);

        this.type = type;

        if(type == 'Black')
            this.image = game.assets[IMAGE_BLACKFENCE];
        else if(type == 'White')
            this.image = game.assets[IMAGE_WHITEFENCE];

        this.x = vx;
        this.y = vy;

        this.visible = false;
    }
});