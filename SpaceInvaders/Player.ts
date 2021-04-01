namespace spaceInvaders {
    import fCore = FudgeCore;
    export class Player extends fCore.Node {
        constructor() {
            super("PlayerMain");
            let materialWineRed: fCore.Material = new fCore.Material("WineRed", fCore.ShaderUniColor, new fCore.CoatColored(new fCore.Color(0.6, 0.1, 0.3, 1)));
            let cmpMaterial: fCore.ComponentMaterial = new fCore.ComponentMaterial(materialGreen);
            let torusMesh: fCore.Mesh = new fCore.MeshTorus("Torus");

            let playerChildNode: fCore.Node = new fCore.Node("Kanonenrohr");
            let cmpMaterialKanonenrohr: fCore.ComponentMaterial = new fCore.ComponentMaterial(materialWineRed);
            let kanonenRohrMesh: fCore.Mesh = new fCore.MeshQuad("KanonenRohrMesh");

            this.addComponent(new fCore.ComponentTransform());
            this.addComponent(new fCore.ComponentMesh(torusMesh));
            this.addComponent(cmpMaterial);

            this.mtxLocal.scale(new fCore.Vector3(0.2, 0.2, 0.2));
            this.mtxLocal.translateY(-4);

            playerChildNode.addComponent(new fCore.ComponentTransform());
            playerChildNode.addComponent(new fCore.ComponentMesh(kanonenRohrMesh));
            playerChildNode.addComponent(cmpMaterialKanonenrohr);
            playerChildNode.mtxLocal.scale(new fCore.Vector3(0.1, 0.6, 0.1));
            playerChildNode.mtxLocal.translateY(0.5);
            this.addChild(playerChildNode);
        }
    }
}