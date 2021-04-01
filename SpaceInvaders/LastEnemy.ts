namespace spaceInvaders {
    import fCore = FudgeCore;
    export class LastEnemy extends fCore.Node {
        constructor() {
            super("LastEnemy");
            let pyramideEnemy: fCore.Mesh = new fCore.MeshPyramid("Pyramide");
            let cmpMaterialQuad: fCore.ComponentMaterial = new fCore.ComponentMaterial(materialRed);

            this.addComponent(new fCore.ComponentMesh(pyramideEnemy));
            this.addComponent(new fCore.ComponentTransform());
            this.addComponent(cmpMaterialQuad);

            this.mtxLocal.scale(new fCore.Vector3(0.25, 0.25, 0.25));
            this.mtxLocal.translateY(3.5);
            this.mtxLocal.rotateX(180);
        }
    }
}