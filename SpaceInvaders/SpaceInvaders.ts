
namespace SpaceInvaders {
    import fCore = FudgeCore;
    window.addEventListener("load", init);
    export let space: fCore.Node = new fCore.Node("SpaceInvaders");
    export let viewport: fCore.Viewport = new fCore.Viewport();
    export let materialGreen: fCore.Material = new fCore.Material("Green", fCore.ShaderUniColor, new fCore.CoatColored(new fCore.Color(0, 1, 0, 0.6)));
    export let materialWineRed: fCore.Material = new fCore.Material("WineRed", fCore.ShaderUniColor, new fCore.CoatColored(new fCore.Color(0.6, 0.1, 0.3, 1)));
    let mainPlayer: fCore.Node = new Player();
    let lastEnemy: fCore.Node = new LastEnemy();
    let cmpCamera: fCore.ComponentCamera = new fCore.ComponentCamera();

    function init(_event: Event): void {
        let translationX: number = 0;
        let translationY: number = 0;
        let canvas: HTMLCanvasElement = document.querySelector("canvas");
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
        console.log(space);

        cmpCamera.mtxPivot.translateZ(3);
        cmpCamera.mtxPivot.rotateY(180);

        viewport.initialize("Viewport", space, cmpCamera, canvas);
        shootParticles();
        viewport.draw();
    }
    function shootParticles(): void {
        let shootParticleNode: fCore.Node = new fCore.Node("shootParticle");
        let shootParticle: fCore.Mesh = new fCore.MeshQuad("shootParticle");
        let cmpMaterialQuad: fCore.ComponentMaterial = new fCore.ComponentMaterial(materialWineRed);

        shootParticleNode.addComponent(new fCore.ComponentMesh(shootParticle));
        shootParticleNode.addComponent(new fCore.ComponentTransform());
        shootParticleNode.addComponent(cmpMaterialQuad);

        shootParticleNode.mtxLocal.scale(new fCore.Vector3(0.05, 0.15, 0.05));
        shootParticleNode.mtxLocal.translateY(12);

        mainPlayer.addChild(shootParticleNode);
    }
}
