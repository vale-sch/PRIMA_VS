"use strict";
var SpaceInvaders;
(function (SpaceInvaders) {
    var fCore = FudgeCore;
    window.addEventListener("load", init);
    SpaceInvaders.space = new fCore.Node("SpaceInvaders");
    SpaceInvaders.viewport = new fCore.Viewport();
    SpaceInvaders.materialGreen = new fCore.Material("Green", fCore.ShaderUniColor, new fCore.CoatColored(new fCore.Color(0, 1, 0, 0.6)));
    SpaceInvaders.materialWineRed = new fCore.Material("WineRed", fCore.ShaderUniColor, new fCore.CoatColored(new fCore.Color(0.6, 0.1, 0.3, 1)));
    let mainPlayer = new SpaceInvaders.Player();
    let lastEnemy = new SpaceInvaders.LastEnemy();
    let cmpCamera = new fCore.ComponentCamera();
    function init(_event) {
        let translationX = 0;
        let translationY = 0;
        let canvas = document.querySelector("canvas");
        let protections = new fCore.Node("protections");
        for (let i = 0; i < 4; i++) {
            translationX += 4;
            let protection = new SpaceInvaders.Protection(translationX);
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
            let invader = new SpaceInvaders.Invader(translationX, translationY);
            invaders.addChild(invader);
        }
        SpaceInvaders.space.addChild(mainPlayer);
        SpaceInvaders.space.addChild(protections);
        SpaceInvaders.space.addChild(invaders);
        SpaceInvaders.space.addChild(lastEnemy);
        console.log(SpaceInvaders.space);
        cmpCamera.mtxPivot.translateZ(3);
        cmpCamera.mtxPivot.rotateY(180);
        SpaceInvaders.viewport.initialize("Viewport", SpaceInvaders.space, cmpCamera, canvas);
        shootParticles();
        SpaceInvaders.viewport.draw();
    }
    function shootParticles() {
        let shootParticleNode = new fCore.Node("shootParticle");
        let shootParticle = new fCore.MeshQuad("shootParticle");
        let cmpMaterialQuad = new fCore.ComponentMaterial(SpaceInvaders.materialWineRed);
        shootParticleNode.addComponent(new fCore.ComponentMesh(shootParticle));
        shootParticleNode.addComponent(new fCore.ComponentTransform());
        shootParticleNode.addComponent(cmpMaterialQuad);
        shootParticleNode.mtxLocal.scale(new fCore.Vector3(0.05, 0.15, 0.05));
        shootParticleNode.mtxLocal.translateY(12);
        mainPlayer.addChild(shootParticleNode);
    }
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=SpaceInvaders.js.map