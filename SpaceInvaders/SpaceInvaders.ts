
namespace spaceInvaders {
    import fCore = FudgeCore;
    window.addEventListener("load", init);
    export let space: fCore.Node = new fCore.Node("SpaceInvaders");
    let viewport: fCore.Viewport = new fCore.Viewport();
    export let materialGreen: fCore.Material = new fCore.Material("GreenMaterial", fCore.ShaderUniColor, new fCore.CoatColored(new fCore.Color(0, 1, 0, 1)));
    export let materialWhite: fCore.Material = new fCore.Material("WhiteMaterial", fCore.ShaderUniColor, new fCore.CoatColored(new fCore.Color(1, 1, 1, 1)));
    export let materialRed: fCore.Material = new fCore.Material("RedMaterial", fCore.ShaderUniColor, new fCore.CoatColored(new fCore.Color(1, 0, 0, 1)));

    function init(_event: Event): void {
        let translationX: number = 0;
        let translationY: number = 0;
        let canvas: HTMLCanvasElement = document.querySelector("canvas");

        let mainPlayer: fCore.Node = new Player();
        let lastEnemy: fCore.Node = new LastEnemy();

        let protections: fCore.Node = new fCore.Node("protections");
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
        space.addChild(mainPlayer);
        space.addChild(protections);
        space.addChild(invaders);
        space.addChild(lastEnemy);

        let cmpCamera: fCore.ComponentCamera = new fCore.ComponentCamera();
        cmpCamera.mtxPivot.translateZ(3);
        cmpCamera.mtxPivot.rotateY(180);

        viewport.initialize("Viewport", space, cmpCamera, canvas);
        viewport.draw();
    }
}
