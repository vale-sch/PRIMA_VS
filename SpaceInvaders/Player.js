"use strict";
var SpaceInvaders;
(function (SpaceInvaders) {
    var fCore = FudgeCore;
    class Player extends fCore.Node {
        constructor() {
            super("PlayerMain");
            let cmpMaterial = new fCore.ComponentMaterial(SpaceInvaders.materialGreen);
            let torusMesh = new fCore.MeshTorus("Torus");
            let playerChildNode = new fCore.Node("Kanonenrohr");
            let cmpMaterialKanonenrohr = new fCore.ComponentMaterial(SpaceInvaders.materialWineRed);
            let kanonenRohrMesh = new fCore.MeshQuad("KanonenRohrMesh");
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
    SpaceInvaders.Player = Player;
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=Player.js.map