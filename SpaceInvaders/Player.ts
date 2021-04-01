namespace spaceInvaders {
    import fCore = FudgeCore;
    export class Player extends fCore.Node {
        constructor() {
            super("PlayerMain");
            let mesh: fCore.Mesh = new fCore.MeshTorus("Torus");
            let cmpMaterial: fCore.ComponentMaterial = new fCore.ComponentMaterial(materialGreen);

            this.addComponent(new fCore.ComponentTransform());
            this.addComponent(new fCore.ComponentMesh(mesh));
            this.addComponent(cmpMaterial);

            this.mtxLocal.scale(new fCore.Vector3(0.2, 0.2, 0.2));
            this.mtxLocal.translateY(-4);
        }
    }
}