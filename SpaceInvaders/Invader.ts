namespace spaceInvaders {
    import fCore = FudgeCore;
    export class Invader extends fCore.Node {
        constructor(_x: number, _y: number) {
            super("Invader" + (_x + _y));
            let quads: fCore.Mesh = new fCore.MeshQuad("Quads");
            let cmpMaterialQuad: fCore.ComponentMaterial = new fCore.ComponentMaterial(materialWhite);

            this.addComponent(new fCore.ComponentMesh(quads));
            this.addComponent(new fCore.ComponentTransform());
            this.addComponent(cmpMaterialQuad);

            this.mtxLocal.scale(new fCore.Vector3(0.1, 0.1, 0.1));
            this.mtxLocal.translateY(8);
            this.mtxLocal.translateX(-17);
            this.mtxLocal.translateX(_x);
            this.mtxLocal.translateY(_y);
        }
    }
}

