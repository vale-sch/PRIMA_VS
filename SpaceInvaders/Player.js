"use strict";
var SpaceInvaders;
(function (SpaceInvaders) {
    var fCore = FudgeCore;
    class Player extends SpaceInvaders.QuadNode {
        constructor() {
            super("PlayerMain", new fCore.Vector2(0, -0.8), new fCore.Vector2(0.15, 0.15));
            let playerChildNode = new fCore.Node("Kanonenrohr");
            let kanonenRohrMesh = new fCore.MeshQuad("KanonenRohrMesh");
            let cmpKanonenRohr = new fCore.ComponentMesh(kanonenRohrMesh);
            let randomColorMat = new fCore.Material("randomMaterial", fCore.ShaderUniColor, new fCore.CoatColored(new fCore.Color(Math.random(), Math.random(), Math.random(), 1)));
            playerChildNode.addComponent(new fCore.ComponentTransform());
            playerChildNode.addComponent(cmpKanonenRohr);
            playerChildNode.addComponent(new fCore.ComponentMaterial(randomColorMat));
            cmpKanonenRohr.mtxPivot.scale(new fCore.Vector3(0.05, 0.1, 0));
            playerChildNode.mtxLocal.translateY(0.1);
            this.addChild(playerChildNode);
        }
    }
    SpaceInvaders.Player = Player;
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=Player.js.map