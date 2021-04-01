namespace SpaceInvaders {
    import fCore = FudgeCore;
    export class Player extends fCore.Node {
        constructor() {
            super("PlayerMain");
            let cmpMaterial: fCore.ComponentMaterial = new fCore.ComponentMaterial(materialGreen);
            let torusMesh: fCore.Mesh = new fCore.MeshTorus("Torus");

            let playerChildNode: fCore.Node = new fCore.Node("Kanonenrohr");
            let cmpMaterialKanonenrohr: fCore.ComponentMaterial = new fCore.ComponentMaterial(materialWineRed);
            let kanonenRohrMesh: fCore.Mesh = new fCore.MeshQuad("KanonenRohrMesh");

            this.addComponent(new fCore.ComponentTransform());
            this.addComponent(new fCore.ComponentMesh(torusMesh));
            this.addComponent(cmpMaterial);

            this.mtxLocal.scale(new fCore.Vector3(0.25, 0.25, 0.25));
            this.mtxLocal.translateY(-3.25);

            playerChildNode.addComponent(new fCore.ComponentTransform());
            playerChildNode.addComponent(new fCore.ComponentMesh(kanonenRohrMesh));
            playerChildNode.addComponent(cmpMaterialKanonenrohr);
            playerChildNode.mtxLocal.scale(new fCore.Vector3(0.25, 0.6, 0.25));
            playerChildNode.mtxLocal.translateY(0.4);
            this.addChild(playerChildNode);
        }
    }
}