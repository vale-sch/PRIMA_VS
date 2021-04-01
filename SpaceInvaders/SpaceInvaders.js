"use strict";
var SpaceInvaders;
(function (SpaceInvaders) {
    var fCore = FudgeCore;
    window.addEventListener("load", init);
    SpaceInvaders.space = new fCore.Node("SpaceInvaders");
    SpaceInvaders.viewport = new fCore.Viewport();
    SpaceInvaders.materialGreen = new fCore.Material("Green", fCore.ShaderUniColor, new fCore.CoatColored(new fCore.Color(0, 1, 0, 0.6)));
    SpaceInvaders.materialWineRed = new fCore.Material("WineRed", fCore.ShaderUniColor, new fCore.CoatColored(new fCore.Color(0.6, 0.1, 0.3, 1)));
    let mainPlayerShip = new SpaceInvaders.Player();
    let movementSpeed = 0.005;
    let lastEnemy = new SpaceInvaders.LastEnemy();
    function init(_event) {
        let canvas = document.querySelector("canvas");
        let translationX = 0;
        let translationY = 0;
        let protections = new fCore.Node("protections");
        protections.addComponent(new fCore.ComponentTransform);
        protections.mtxLocal.scale(new fCore.Vector3(0.2, 0.2, 0.2));
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
        SpaceInvaders.space.addChild(mainPlayerShip);
        SpaceInvaders.space.addChild(protections);
        SpaceInvaders.space.addChild(invaders);
        SpaceInvaders.space.addChild(lastEnemy);
        let cmpCamera = new fCore.ComponentCamera();
        cmpCamera.mtxPivot.translateZ(3);
        cmpCamera.mtxPivot.rotateY(180);
        SpaceInvaders.viewport.initialize("Viewport", SpaceInvaders.space, cmpCamera, canvas);
        fCore.Loop.start(fCore.LOOP_MODE.TIME_REAL, 60);
        fCore.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
    }
    let isRight = true;
    let isLeft = false;
    let moveUp = 0;
    function update(_event) {
        if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.A, fCore.KEYBOARD_CODE.ARROW_LEFT]) && mainPlayerShip.mtxLocal.translation.x > -1.4)
            mainPlayerShip.mtxLocal.translateX(-movementSpeed * fCore.Loop.timeFrameReal);
        if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.D, fCore.KEYBOARD_CODE.ARROW_RIGHT]) && mainPlayerShip.mtxLocal.translation.x < 1.4)
            mainPlayerShip.mtxLocal.translateX(movementSpeed * fCore.Loop.timeFrameReal);
        let shotNodes = new fCore.Node("shotNodes");
        if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.SPACE])) {
            let shotNode = new fCore.Node("shotNode");
            shotNode.addComponent(new fCore.ComponentTransform);
            let shotParticle = new fCore.MeshQuad("shotParticle");
            shotNode.addComponent(new fCore.ComponentMesh(shotParticle));
            shotNode.addComponent(new fCore.ComponentMaterial(SpaceInvaders.materialWineRed));
            shotNode.mtxLocal.scale(new fCore.Vector3(0.1, 0.2, 0.1));
            shotNode.mtxLocal.translateY(moveUp += fCore.Loop.timeFrameReal * 0.0005);
            SpaceInvaders.space.appendChild(shotNodes);
        }
        if (lastEnemy.mtxLocal.translation.x > -1.3 && !isLeft) {
            if (lastEnemy.mtxLocal.translation.x < -1.25) {
                isLeft = true;
                isRight = false;
            }
            lastEnemy.mtxLocal.translateX(-movementSpeed * fCore.Loop.timeFrameReal);
        }
        if (lastEnemy.mtxLocal.translation.x < 1.3 && !isRight) {
            if (lastEnemy.mtxLocal.translation.x > 1.25) {
                isLeft = false;
                isRight = true;
            }
            lastEnemy.mtxLocal.translateX(movementSpeed * fCore.Loop.timeFrameReal);
        }
        SpaceInvaders.viewport.draw();
    }
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=SpaceInvaders.js.map