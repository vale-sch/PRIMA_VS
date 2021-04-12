"use strict";
var SpaceInvaders;
(function (SpaceInvaders) {
    var fCore = FudgeCore;
    window.addEventListener("load", init);
    SpaceInvaders.space = new fCore.Node("SpaceInvaders - Global Space - Parent Node");
    SpaceInvaders.viewport = new fCore.Viewport();
    SpaceInvaders.mainPlayerShip = new SpaceInvaders.Player();
    SpaceInvaders.projectilesContainer = new fCore.Node("projectilesContainer");
    SpaceInvaders.movementSpeed = 0.5;
    let isRightEnemy = true;
    let isLeftEnemy = false;
    let isRightInvaders = true;
    let isLeftInvaders = false;
    let shootTimer = 2;
    let lastEnemy = new SpaceInvaders.LastEnemy();
    let protectionsContainer = new fCore.Node("protectionsContainer");
    let protectionContainer = new fCore.Node("protectionNode");
    let invadersSpeedFactor = 0.076;
    let invadersCounter = 0;
    let invadersContainer = new fCore.Node("invadersContainer");
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
        for (let i = 0; i < 4; i++) {
            protectionContainer = new fCore.Node("protectionNode");
            protectionContainer.addComponent(new fCore.ComponentTransform);
            translationX += 0.8;
            protectionContainer.mtxLocal.translateX(translationX - 10.5 / 5);
            protectionContainer.mtxLocal.translateY(-0.5);
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    let protectionStripe = new SpaceInvaders.ProtectionsStripes("ProtectionsStripe", new fCore.Vector2(i / 12.5, j / 12.5));
                    protectionContainer.appendChild(protectionStripe);
                }
            }
            protectionsContainer.appendChild(protectionContainer);
        }
        translationX = 0;
        invadersContainer.addComponent(new fCore.ComponentTransform);
        invadersContainer.mtxLocal.translateX(-1.675);
        invadersContainer.mtxLocal.translateY(0.9);
        for (let i = 0; i < 48; i++) {
            translationX += 0.2;
            if (i % 16 == 0) {
                translationX = 0.175;
                translationY -= 0.3;
            }
            let invader = new SpaceInvaders.Invader(translationX, translationY);
            invadersContainer.addChild(invader);
        }
        SpaceInvaders.projectilesContainer.addComponent(new fCore.ComponentTransform);
    }
    function appendToFatherTree() {
        SpaceInvaders.space.addChild(SpaceInvaders.mainPlayerShip);
        SpaceInvaders.space.addChild(protectionsContainer);
        SpaceInvaders.space.addChild(invadersContainer);
        SpaceInvaders.space.addChild(lastEnemy);
        SpaceInvaders.space.addChild(SpaceInvaders.projectilesContainer);
        console.log(SpaceInvaders.space);
    }
    function update(_event) {
        SpaceInvaders.deltaTime = fCore.Loop.timeFrameGame / 1000;
        shootTimer -= SpaceInvaders.deltaTime;
        handlePlayerMovement();
        handleEnemyAndInvadersMovement();
        checkProjectileCollision();
        checkCollisionOfQuadStripes();
        SpaceInvaders.viewport.draw();
    }
    function handlePlayerMovement() {
        if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.A, fCore.KEYBOARD_CODE.ARROW_LEFT]) && SpaceInvaders.mainPlayerShip.mtxLocal.translation.x > -1.5)
            SpaceInvaders.mainPlayerShip.mtxLocal.translateX(-SpaceInvaders.movementSpeed * SpaceInvaders.deltaTime);
        if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.D, fCore.KEYBOARD_CODE.ARROW_RIGHT]) && SpaceInvaders.mainPlayerShip.mtxLocal.translation.x < 1.5)
            SpaceInvaders.mainPlayerShip.mtxLocal.translateX(SpaceInvaders.movementSpeed * SpaceInvaders.deltaTime);
        if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.SPACE]) && shootTimer <= 0) {
            let projectileChildNode = new SpaceInvaders.Projectile();
            SpaceInvaders.projectilesContainer.addChild(projectileChildNode);
            shootTimer = 0.4;
        }
        //PROJEKTILE SKRIPT
        //verinfachte Schreibweise
        for (let projectile of SpaceInvaders.projectilesContainer.getChildren()) {
            if (projectile.mtxLocal.translation.y < 1.2)
                projectile.movingUpProjectile(SpaceInvaders.deltaTime);
            else
                SpaceInvaders.projectilesContainer.removeChild(projectile);
        }
    }
    function handleEnemyAndInvadersMovement() {
        if (lastEnemy.mtxLocal.translation.x > -1.45 && !isLeftEnemy) {
            if (lastEnemy.mtxLocal.translation.x < -1.4) {
                isLeftEnemy = true;
                isRightEnemy = false;
            }
            lastEnemy.mtxLocal.translateX(-SpaceInvaders.movementSpeed * SpaceInvaders.deltaTime);
        }
        if (lastEnemy.mtxLocal.translation.x < 1.45 && !isRightEnemy) {
            if (lastEnemy.mtxLocal.translation.x > 1.4) {
                isLeftEnemy = false;
                isRightEnemy = true;
            }
            lastEnemy.mtxLocal.translateX(SpaceInvaders.movementSpeed * SpaceInvaders.deltaTime);
        }
        if (invadersContainer.mtxLocal.translation.x > -1.8 && !isLeftInvaders) {
            if (invadersContainer.mtxLocal.translation.x < -1.75) {
                invadersCounter++;
                isLeftInvaders = true;
                isRightInvaders = false;
            }
            invadersContainer.mtxLocal.translateX(-invadersSpeedFactor * SpaceInvaders.deltaTime);
        }
        if (invadersContainer.mtxLocal.translation.x < -1.5 && !isRightInvaders) {
            if (invadersContainer.mtxLocal.translation.x > -1.6) {
                invadersCounter++;
                isLeftInvaders = false;
                isRightInvaders = true;
            }
            invadersContainer.mtxLocal.translateX(invadersSpeedFactor * SpaceInvaders.deltaTime);
        }
        if (invadersCounter != 0)
            if (invadersCounter % 4 == 0) {
                invadersSpeedFactor += 0.00025;
                invadersContainer.mtxLocal.translateY(-0.0001);
            }
    }
    function checkProjectileCollision() {
        for (let projectile of SpaceInvaders.projectilesContainer.getChildren()) {
            for (let invader of invadersContainer.getChildren()) {
                if (projectile.checkCollision(invader)) {
                    SpaceInvaders.projectilesContainer.removeChild(projectile);
                    invadersContainer.removeChild(invader);
                }
            }
        }
    }
    function checkCollisionOfQuadStripes() {
        for (let projectile of SpaceInvaders.projectilesContainer.getChildren()) {
            for (let protectionStripes of protectionContainer.getChildren()) {
                if (projectile.checkCollision(protectionStripes)) {
                    SpaceInvaders.projectilesContainer.removeChild(projectile);
                    protectionsContainer.removeChild(protectionStripes);
                }
            }
        }
    }
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=SpaceInvaders.js.map