namespace SpaceInvaders {
    import fCore = FudgeCore;
    export class Protection extends fCore.Node {
        constructor(_x: number) {
            super("Protection" + _x);
            let quads: fCore.Mesh = new fCore.MeshQuad("Quads");
            let cmpMaterialQuad: fCore.ComponentMaterial = new fCore.ComponentMaterial(materialGreen);

            this.addComponent(new fCore.ComponentMesh(quads));
            this.addComponent(new fCore.ComponentTransform());
            this.addComponent(cmpMaterialQuad);

            this.mtxLocal.scale(new fCore.Vector3(0.2, 0.2, 0.2));
            this.mtxLocal.translateY(-2);
            this.mtxLocal.translateX(-10);
            this.mtxLocal.translateX(_x);
        }
    }
}
