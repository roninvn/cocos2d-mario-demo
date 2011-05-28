var cocos   = require('cocos2d'),
    geo     = require('geometry'),
    coconut = require('coconut');

var Player = coconut.entities.Entity.extend(/** @lends entities.Player# */{
    maximumSpeed: 150,
    acceleration: 200,
    deceleration: 300,

    /**
     * @member entities
     * @extends coconut.Entity
     * @constructs
     */
    init: function(opts) {
        Player.superclass.init.call(this, opts);

        var ap = geo.ccp(0.5, 0.5);
        this.set('anchorPoint', ap);

        var s = cocos.nodes.Sprite.create({file: opts.file, rect: opts.rect});       
        s.set('anchorPoint', geo.ccp(0, 0));
        this.set('contentSize', s.get('contentSize'));
        this.addChild(s);

        this.addComponent({component: 'Gravitate', priority: 0});
        this.addComponent({component: 'Actor',     priority: 0});
        this.addComponent({component: 'Velocity',  priority: 1});
        this.addComponent({component: 'Collides',  priority: 2});
    }
});

exports.Player = Player;
