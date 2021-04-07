
namespace SpaceInvaders {
    import fCore = FudgeCore;
    window.addEventListener("load", init);

    export let space: fCore.Node = new fCore.Node("SpaceInvaders");
    export let viewport: fCore.Viewport = new fCore.Viewport();
    export let mainPlayerShip: fCore.Node = new Player();
    export let projectilesNode: fCore.Node = new fCore.Node("shotNode");
    export let deltaTime: number;
    export let movementSpeed: number = 0.0005;

    let isRight: boolean = true;
    let isLeft: boolean = false;
    let shootTimer: number = 2;
    let lastEnemy: fCore.Node = new LastEnemy();
    let protections: fCore.Node = new fCore.Node("protections");
    let invaders: fCore.Node = new fCore.Node("invaders");

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

        protections.addComponent(new fCore.ComponentTransform);
        protections.mtxLocal.scale(new fCore.Vector3(0.2, 0.2, 0.2));
        for (let i: number = 0; i < 4; i++) {
            translationX += 4;
            let protection: fCore.Node = new Protection(translationX);
            protections.addChild(protection);
        }
        translationX = 0;

        for (let i: number = 0; i < 48; i++) {
            translationX += 0.2;
            if (i % 16 == 0) {
                translationX = 0.175;
                translationY -= 0.3;
            }
            let invader: fCore.Node = new Invader(translationX, translationY);
            invaders.addChild(invader);
        }
        projectilesNode.addComponent(new fCore.ComponentTransform);
    }

    function appendToFatherTree(): void {
        space.addChild(mainPlayerShip);
        space.addChild(protections);
        space.addChild(invaders);
        space.addChild(lastEnemy);
        space.addChild(projectilesNode);
        console.log(space);
    }

    function update(_event: Event): void {
        deltaTime = fCore.Loop.timeFrameGame / 1000;
        shootTimer -= deltaTime;

        handlePlayerMovement();

        handleEnemyMovement();

        viewport.draw();
    }

    function handlePlayerMovement(): void {
        if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.A, fCore.KEYBOARD_CODE.ARROW_LEFT]) && mainPlayerShip.mtxLocal.translation.x > -1.4)
            mainPlayerShip.mtxLocal.translateX(2 * -movementSpeed * fCore.Loop.timeFrameReal);
        if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.D, fCore.KEYBOARD_CODE.ARROW_RIGHT]) && mainPlayerShip.mtxLocal.translation.x < 1.4)
            mainPlayerShip.mtxLocal.translateX(2 * movementSpeed * fCore.Loop.timeFrameReal);

        if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.SPACE]) && shootTimer <= 0) {
            let projectileChildNode: fCore.Node = new Projectile();
            projectilesNode.addChild(projectileChildNode);
            shootTimer = 0.667;
        }
        //PROJEKTILE SKRIPT
        projectilesNode.getChildren().forEach(projectile => {
            if (projectile.mtxLocal.translation.y < 1.2) {

                let realProjectile: Projectile = <Projectile>projectile;
                realProjectile.movingUpProjectile(deltaTime);
            }
            else {
                console.log("Removed Child at an Height of: " + projectile.mtxLocal.translation.y.toFixed(3));
                projectilesNode.removeChild(projectile);
            }
        });
    }

    function handleEnemyMovement(): void {
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
    }
}
