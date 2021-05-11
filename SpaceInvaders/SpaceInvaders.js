"use strict";
var SpaceInvaders;
(function (SpaceInvaders) {
    var fCore = FudgeCore;
    window.addEventListener("load", init);
    SpaceInvaders.space = new fCore.Node("SpaceInvaders");
    SpaceInvaders.viewport = new fCore.Viewport();
    SpaceInvaders.mainPlayerShip = new SpaceInvaders.Player();
    SpaceInvaders.projectilesNode = new fCore.Node("shotNode");
    SpaceInvaders.movementSpeed = 0.0005;
    let isRight = true;
    let isLeft = false;
    let shootTimer = 2;
    let lastEnemy = new SpaceInvaders.LastEnemy();
    let protections = new fCore.Node("protections");
    let invaders = new fCore.Node("invaders");
    function init(_event) {
        let canvas = document.querySelector("canvas");
        buildGraphics();
        appendToFatherTree();
        let cmpCamera = new fCore.ComponentCamera();
        cmpCamera.mtxPivot.translateZ(3);
        cmpCamera.mtxPivot.rotateY(180);
        SpaceInvaders.viewport.initialize("Viewport", SpaceInvaders.space, cmpCamera, canvas);
        fCore.Loop.start(fCore.LOOP_MODE.TIME_REAL, 60);
        fCore.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
    }
    function buildGraphics() {
        let translationX = 0;
        let translationY = 0;
        protections.addComponent(new fCore.ComponentTransform);
        protections.mtxLocal.scale(new fCore.Vector3(0.2, 0.2, 0.2));
        for (let i = 0; i < 4; i++) {
            translationX += 4;
            let protection = new SpaceInvaders.Protection(translationX);
            protections.addChild(protection);
        }
        translationX = 0;
        for (let i = 0; i < 48; i++) {
            translationX += 0.2;
            if (i % 16 == 0) {
                translationX = 0.175;
                translationY -= 0.3;
            }
            let invader = new SpaceInvaders.Invader(translationX, translationY);
            invaders.addChild(invader);
        }
        SpaceInvaders.projectilesNode.addComponent(new fCore.ComponentTransform);
    }
    function appendToFatherTree() {
        SpaceInvaders.space.addChild(SpaceInvaders.mainPlayerShip);
        SpaceInvaders.space.addChild(protections);
        SpaceInvaders.space.addChild(invaders);
        SpaceInvaders.space.addChild(lastEnemy);
        SpaceInvaders.space.addChild(SpaceInvaders.projectilesNode);
        console.log(SpaceInvaders.space);
    }
    function update(_event) {
        SpaceInvaders.deltaTime = fCore.Loop.timeFrameGame / 1000;
        shootTimer -= SpaceInvaders.deltaTime;
        handlePlayerMovement();
        handleEnemyMovement();
        SpaceInvaders.viewport.draw();
    }
    function handlePlayerMovement() {
        if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.A, fCore.KEYBOARD_CODE.ARROW_LEFT]) && SpaceInvaders.mainPlayerShip.mtxLocal.translation.x > -1.4)
            SpaceInvaders.mainPlayerShip.mtxLocal.translateX(2 * -SpaceInvaders.movementSpeed * fCore.Loop.timeFrameReal);
        if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.D, fCore.KEYBOARD_CODE.ARROW_RIGHT]) && SpaceInvaders.mainPlayerShip.mtxLocal.translation.x < 1.4)
            SpaceInvaders.mainPlayerShip.mtxLocal.translateX(2 * SpaceInvaders.movementSpeed * fCore.Loop.timeFrameReal);
        if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.SPACE]) && shootTimer <= 0) {
            let projectileChildNode = new SpaceInvaders.Projectile();
            SpaceInvaders.projectilesNode.addChild(projectileChildNode);
            shootTimer = 0.667;
        }
        //PROJEKTILE SKRIPT
        SpaceInvaders.projectilesNode.getChildren().forEach(projectile => {
            if (projectile.mtxLocal.translation.y < 1.2) {
                let realProjectile = projectile;
                realProjectile.movingUpProjectile(SpaceInvaders.deltaTime);
            }
            else {
                console.log("Removed Child at an Height of: " + projectile.mtxLocal.translation.y.toFixed(3));
                SpaceInvaders.projectilesNode.removeChild(projectile);
            }
        });
    }
    function handleEnemyMovement() {
        if (lastEnemy.mtxLocal.translation.x > -1.3 && !isLeft) {
            if (lastEnemy.mtxLocal.translation.x < -1.25) {
                isLeft = true;
                isRight = false;
            }
            lastEnemy.mtxLocal.translateX(-SpaceInvaders.movementSpeed * fCore.Loop.timeFrameReal);
        }
        if (lastEnemy.mtxLocal.translation.x < 1.3 && !isRight) {
            if (lastEnemy.mtxLocal.translation.x > 1.25) {
                isLeft = false;
                isRight = true;
            }
            lastEnemy.mtxLocal.translateX(SpaceInvaders.movementSpeed * fCore.Loop.timeFrameReal);
        }
    }
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=SpaceInvaders.js.map