"use strict";
var spaceInvaders;
(function (spaceInvaders) {
    var fCore = FudgeCore;
    window.addEventListener("load", init);
    spaceInvaders.space = new fCore.Node("SpaceInvaders");
    let viewport = new fCore.Viewport();
    spaceInvaders.materialGreen = new fCore.Material("GreenMaterial", fCore.ShaderUniColor, new fCore.CoatColored(new fCore.Color(0, 1, 0, 1)));
    spaceInvaders.materialWhite = new fCore.Material("WhiteMaterial", fCore.ShaderUniColor, new fCore.CoatColored(new fCore.Color(1, 1, 1, 1)));
    spaceInvaders.materialRed = new fCore.Material("RedMaterial", fCore.ShaderUniColor, new fCore.CoatColored(new fCore.Color(1, 0, 0, 1)));
    function init(_event) {
        let translationX = 0;
        let translationY = 0;
        let canvas = document.querySelector("canvas");
        let mainPlayer = new spaceInvaders.Player();
        let lastEnemy = new spaceInvaders.LastEnemy();
        let protections = new fCore.Node("protections");
        for (let i = 0; i < 4; i++) {
            translationX += 4;
            let protection = new spaceInvaders.Protection(translationX);
            protections.addChild(protection);
        }
        translationX = 0;
        let invaders = new fCore.Node("invaders");
        for (let i = 0; i < 48; i++) {
            translationX += 2;
            if (i % 16 == 0) {
                translationX = 1.75;
                translationY -= 3;
            }
            let invader = new spaceInvaders.Invader(translationX, translationY);
            invaders.addChild(invader);
        }
        spaceInvaders.space.addChild(mainPlayer);
        spaceInvaders.space.addChild(protections);
        spaceInvaders.space.addChild(invaders);
        spaceInvaders.space.addChild(lastEnemy);
        let cmpCamera = new fCore.ComponentCamera();
        cmpCamera.mtxPivot.translateZ(3);
        cmpCamera.mtxPivot.rotateY(180);
        viewport.initialize("Viewport", spaceInvaders.space, cmpCamera, canvas);
        viewport.draw();
    }
})(spaceInvaders || (spaceInvaders = {}));
//# sourceMappingURL=SpaceInvaders.js.map