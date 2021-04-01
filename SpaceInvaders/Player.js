"use strict";
var spaceInvaders;
(function (spaceInvaders) {
    var fCore = FudgeCore;
    class Player extends fCore.Node {
        constructor() {
            super("PlayerMain");
            let materialWineRed = new fCore.Material("WineRed", fCore.ShaderUniColor, new fCore.CoatColored(new fCore.Color(0.6, 0.1, 0.3, 1)));
            let cmpMaterial = new fCore.ComponentMaterial(spaceInvaders.materialGreen);
            let torusMesh = new fCore.MeshTorus("Torus");
            let playerChildNode = new fCore.Node("Kanonenrohr");
            let cmpMaterialKanonenrohr = new fCore.ComponentMaterial(materialWineRed);
            let kanonenRohrMesh = new fCore.MeshQuad("KanonenRohrMesh");
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
    spaceInvaders.Player = Player;
})(spaceInvaders || (spaceInvaders = {}));
//# sourceMappingURL=Player.js.map