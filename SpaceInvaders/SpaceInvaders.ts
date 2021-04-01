
namespace SpaceInvaders {
    import fCore = FudgeCore;
    window.addEventListener("load", init);
    export let space: fCore.Node = new fCore.Node("SpaceInvaders");
    export let viewport: fCore.Viewport = new fCore.Viewport();
    export let materialGreen: fCore.Material = new fCore.Material("Green", fCore.ShaderUniColor, new fCore.CoatColored(new fCore.Color(0, 1, 0, 0.6)));
    export let materialWineRed: fCore.Material = new fCore.Material("WineRed", fCore.ShaderUniColor, new fCore.CoatColored(new fCore.Color(0.6, 0.1, 0.3, 1)));

    let mainPlayerShip: fCore.Node = new Player();
    let movementSpeed: number = 0.005;

    let lastEnemy: fCore.Node = new LastEnemy();
    
    function init(_event: Event): void {
        let canvas: HTMLCanvasElement = document.querySelector("canvas");

        let translationX: number = 0;
        let translationY: number = 0;
        let protections: fCore.Node = new fCore.Node("protections");
        protections.addComponent(new fCore.ComponentTransform);
        protections.mtxLocal.scale(new fCore.Vector3(0.2, 0.2, 0.2));
        for (let i: number = 0; i < 4; i++) {
            translationX += 4;
            let protection: fCore.Node = new Protection(translationX);
            protections.addChild(protection);
        }
        translationX = 0;
        let invaders: fCore.Node = new fCore.Node("invaders");
        for (let i: number = 0; i < 48; i++) {
            translationX += 2;
            if (i % 16 == 0) {
                translationX = 1.75;
                translationY -= 3;
            }
            let invader: fCore.Node = new Invader(translationX, translationY);
            invaders.addChild(invader);
        }
        space.addChild(mainPlayerShip);
        space.addChild(protections);
        space.addChild(invaders);
        space.addChild(lastEnemy);

        let cmpCamera: fCore.ComponentCamera = new fCore.ComponentCamera();
        cmpCamera.mtxPivot.translateZ(3);
        cmpCamera.mtxPivot.rotateY(180);

        viewport.initialize("Viewport", space, cmpCamera, canvas);

        fCore.Loop.start(fCore.LOOP_MODE.TIME_REAL, 60);
        fCore.Loop.addEventListener(fCore.EVENT.LOOP_FRAME, update);
    }
    
    let isRight: boolean = true;
    let isLeft: boolean = false;
    let moveUp: number = 0;
    function update(_event: Event): void {
       if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.A, fCore.KEYBOARD_CODE.ARROW_LEFT]) && mainPlayerShip.mtxLocal.translation.x > -1.4)
           mainPlayerShip.mtxLocal.translateX(-movementSpeed * fCore.Loop.timeFrameReal);
       if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.D, fCore.KEYBOARD_CODE.ARROW_RIGHT]) && mainPlayerShip.mtxLocal.translation.x < 1.4)
           mainPlayerShip.mtxLocal.translateX(movementSpeed * fCore.Loop.timeFrameReal);
       let shotNodes: fCore.Node = new fCore.Node("shotNodes");
       if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.SPACE])) {
           let shotNode: fCore.Node = new fCore.Node("shotNode");
           shotNode.addComponent(new fCore.ComponentTransform);
           let shotParticle: fCore.Mesh = new fCore.MeshQuad("shotParticle");
           shotNode.addComponent(new fCore.ComponentMesh(shotParticle));
           shotNode.addComponent(new fCore.ComponentMaterial(materialWineRed));
           shotNode.mtxLocal.scale(new fCore.Vector3(0.1, 0.2, 0.1));
           shotNode.mtxLocal.translateY(moveUp += fCore.Loop.timeFrameReal * 0.0005);
           space.appendChild(shotNodes);
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

       viewport.draw();
    }
}
