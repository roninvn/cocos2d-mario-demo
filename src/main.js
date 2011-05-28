/*globals module exports resource require BObject BArray __dirname*/
/*jslint undef: true, strict: true, white: true, newcap: true, browser: true, indent: 4 */
"use strict";

var cocos = require('cocos2d'),
    util = require('util'),
    events = require('events'),
    geo   = require('geometry'),
    coconut = require('coconut'),
    entities = require('./entities');

var CoconutJoe = coconut.World.extend(/** @scope CoconutJoe# */{
    map: null,

    /**
     * @extends coconut.World
     * @constructs
     */
    init: function (opts) {
        CoconutJoe.superclass.init.call(this, opts);

        // Add level tilemap
        var map = coconut.Map.create({file: __dirname + '/resources/mario-level1.tmx'});
        this.set('map', map);
        this.addEntity(map);

        // Add our player
        var player = entities.Player.create({file: __dirname + '/resources/mario-sprite.png', rect: geo.rectMake(0, 0, 17, 16)});
        player.set('position', geo.ccp(300, 400));


        // Player is controlled by the keyboard
        player.addComponent('KeyboardController');
        this.addEntity(player);

        var camera = coconut.entities.PlayerCamera.create();
        camera.set('targetEntity', player);
        this.addCamera(camera);

        /*

        // Add an enemy
        var enemy = entities.Enemy.create();
        this.addEntity(enemy)

        // Enemy is controlled by AI
        var aiController = coconut.AIController.create();
        enemty.set('controller', aiController);
        */
    },
   
    updateCamera: function (oldTarget) {
        oldTarget = oldTarget || this.get('cameraTarget');

        var p = this.get('cameraTarget');
        this.set('position', geo.ccp(-p.x + 320 / 2, -p.y + 240 / 2));
        return;

        var target = this.get('cameraTarget'),
            pos = this.get('position'),
            size = cocos.Director.get('sharedDirector').get('winSize'),
            map = this.get('map'),
            mapSize = map.get('contentSize');

        // if target is in the right 3rd then move
        if (target.x + pos.x > size.width * (9/16)) {
            pos.x = -(target.x - size.width * (9/16));
        }
        // if target is in the left 3rd then move
        else if (target.x + pos.x < size.width * (7/16)) {
            pos.x = -(target.x - size.width * (7/16));
        }

        if (size.height < mapSize.height) {
            // if target is in the bottom 4th then move
            if (target.y + pos.y > size.height * (3/4)) {
                pos.y = -(target.y - size.height * (3/4));
            }
            // if target is in the top 4th then move
            else if (target.y + pos.y < size.height * (1/4)) {
                pos.y = -(target.y - size.height * (1/4));
            }
        }


        // Adjust if showing off the edge of the map
        var left = 0,
            right = -mapSize.width + size.width,
            top = 0,
            bottom = -mapSize.height + size.height;

        if (pos.x > left) {
            pos.x = left;
        } else if (pos.x < right) {
            pos.x = right;
        }

        if (size.height < mapSize.height) {
            if (pos.y > top) {
                pos.y = top;
            } else if (pos.y < bottom) {
                pos.y = bottom;
            }
        }
        
        this.set('position', pos);
    }
});

// Initialise everything
var director = cocos.Director.get('sharedDirector');
director.attachInView(document.getElementById('coconut-joe-container'));
director.set('backgroundColor', '#6b88ff');
director.set('displayFPS', true);
var scene = cocos.nodes.Scene.create();
scene.addChild({child: CoconutJoe.create()});
director.runWithScene(scene);
director.canvas.style.width = '640px';
director.canvas.style.height = '480px';
