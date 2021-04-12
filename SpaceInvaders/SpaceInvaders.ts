namespace SpaceInvaders {
    import fCore = FudgeCore;
    window.addEventListener("load", init);

    export let space: fCore.Node = new fCore.Node("SpaceInvaders - Global Space - Parent Node");
    export let viewport: fCore.Viewport = new fCore.Viewport();
    export let mainPlayerShip: fCore.Node = new Player();
    export let projectilesContainer: fCore.Node = new fCore.Node("projectilesContainer");
    export let deltaTime: number;
    export let movementSpeed: number = 0.5;

    let isRightEnemy: boolean = true;
    let isLeftEnemy: boolean = false;
    let isRightInvaders: boolean = true;
    let isLeftInvaders: boolean = false;
    let shootTimer: number = 2;
    let lastEnemy: fCore.Node = new LastEnemy();
    let protectionsContainer: fCore.Node = new fCore.Node("protectionsContainer");
    let protectionContainer: fCore.Node = new fCore.Node("protectionNode");
    let invadersSpeedFactor: number = 0.076;
    let invadersCounter: number = 0;
    let invadersContainer: fCore.Node = new fCore.Node("invadersContainer");

    function init(_event: Event): void {
        let canvas: HTMLCanvasElement = document.querySelector("canvas");
        buildGraphics();
        appendToFatherTree();

        let cmpCamera: fCore.ComponentCamera = new fCore.ComponentCamera();
        cmpCamera.mtxPivot.translateZ(3);
        cmpCamera.mtxPivot.rotateY(180);

        viewport.initialize("Viewport", space, cmpCamera, canvas);

        fCore.Loop.start(fCore.LOOP_MODE.TIME_REAL, 60);
        fCore.Loop.addEventListener(fCore.EVENT.LOOP_FRAME, update);
    }

    function buildGraphics(): void {
        let translationX: number = 0;
        let translationY: number = 0;


        for (let i: number = 0; i < 4; i++) {
            protectionContainer = new fCore.Node("protectionNode");
            protectionContainer.addComponent(new fCore.ComponentTransform);

            translationX += 0.8;
            protectionContainer.mtxLocal.translateX(translationX - 10.5 / 5);
            protectionContainer.mtxLocal.translateY(-0.5);

            for (let i: number = 0; i < 4; i++) {
                for (let j: number = 0; j < 4; j++) {
                    let protectionStripe: ProtectionsStripes = new ProtectionsStripes("ProtectionsStripe", new fCore.Vector2(i / 12.5, j / 12.5));
                    protectionContainer.appendChild(protectionStripe);
                }
            }
            protectionsContainer.appendChild(protectionContainer);
        }
        translationX = 0;
        invadersContainer.addComponent(new fCore.ComponentTransform);
        invadersContainer.mtxLocal.translateX(-1.675);
        invadersContainer.mtxLocal.translateY(0.9);
        for (let i: number = 0; i < 48; i++) {
            translationX += 0.2;
            if (i % 16 == 0) {
                translationX = 0.175;
                translationY -= 0.3;
            }
            let invader: fCore.Node = new Invader(translationX, translationY);
            invadersContainer.addChild(invader);
        }
        projectilesContainer.addComponent(new fCore.ComponentTransform);
    }

    function appendToFatherTree(): void {
        space.addChild(mainPlayerShip);
        space.addChild(protectionsContainer);
        space.addChild(invadersContainer);
        space.addChild(lastEnemy);
        space.addChild(projectilesContainer);
        console.log(space);
    }

    function update(_event: Event): void {
        deltaTime = fCore.Loop.timeFrameGame / 1000;
        shootTimer -= deltaTime;

        handlePlayerMovement();

        handleEnemyAndInvadersMovement();

        checkProjectileCollision();
        checkCollisionOfQuadStripes();


        viewport.draw();
    }

    function handlePlayerMovement(): void {
        if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.A, fCore.KEYBOARD_CODE.ARROW_LEFT]) && mainPlayerShip.mtxLocal.translation.x > -1.5)
            mainPlayerShip.mtxLocal.translateX(-movementSpeed * deltaTime);
        if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.D, fCore.KEYBOARD_CODE.ARROW_RIGHT]) && mainPlayerShip.mtxLocal.translation.x < 1.5)
            mainPlayerShip.mtxLocal.translateX(movementSpeed * deltaTime);

        if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.SPACE]) && shootTimer <= 0) {
            let projectileChildNode: fCore.Node = new Projectile();
            projectilesContainer.addChild(projectileChildNode);
            shootTimer = 0.4;
        }
        //PROJEKTILE SKRIPT
        //verinfachte Schreibweise
        for (let projectile of projectilesContainer.getChildren() as Projectile[]) {
            if (projectile.mtxLocal.translation.y < 1.2)
                projectile.movingUpProjectile(deltaTime);
            else
                projectilesContainer.removeChild(projectile);
        }
    }

    function handleEnemyAndInvadersMovement(): void {
        if (lastEnemy.mtxLocal.translation.x > -1.45 && !isLeftEnemy) {
            if (lastEnemy.mtxLocal.translation.x < -1.4) {
                isLeftEnemy = true;
                isRightEnemy = false;
            }
            lastEnemy.mtxLocal.translateX(-movementSpeed * deltaTime);
        }
        if (lastEnemy.mtxLocal.translation.x < 1.45 && !isRightEnemy) {
            if (lastEnemy.mtxLocal.translation.x > 1.4) {
                isLeftEnemy = false;
                isRightEnemy = true;
            }
            lastEnemy.mtxLocal.translateX(movementSpeed * deltaTime);
        }
        if (invadersContainer.mtxLocal.translation.x > -1.8 && !isLeftInvaders) {
            if (invadersContainer.mtxLocal.translation.x < -1.75) {
                invadersCounter++;
                isLeftInvaders = true;
                isRightInvaders = false;
            }
            invadersContainer.mtxLocal.translateX(-invadersSpeedFactor * deltaTime);
        }
        if (invadersContainer.mtxLocal.translation.x < -1.5 && !isRightInvaders) {
            if (invadersContainer.mtxLocal.translation.x > -1.6) {
                invadersCounter++;
                isLeftInvaders = false;
                isRightInvaders = true;
            }
            invadersContainer.mtxLocal.translateX(invadersSpeedFactor * deltaTime);
        }
        if (invadersCounter != 0)
            if (invadersCounter % 4 == 0) {
                invadersSpeedFactor += 0.00025;
                invadersContainer.mtxLocal.translateY(-0.0001);
            }
    }
    function checkProjectileCollision(): void {
        for (let projectile of projectilesContainer.getChildren() as Projectile[]) {
            for (let invader of invadersContainer.getChildren() as Invader[]) {
                if (projectile.checkCollision(invader)) {
                    projectilesContainer.removeChild(projectile);
                    invadersContainer.removeChild(invader);
                }
            }
        }
    }

    function checkCollisionOfQuadStripes(): void {
        for (let projectile of projectilesContainer.getChildren() as Projectile[]) {
            for (let protectionStripes of protectionContainer.getChildren() as ProtectionsStripes[]) {
                if (projectile.checkCollision(protectionStripes)) {
                    projectilesContainer.removeChild(projectile);
                    protectionsContainer.removeChild(protectionStripes);
                }
            }
        }
    }
}
