"use strict";
var spaceInvaders;
(function (spaceInvaders) {
    var fCore = FudgeCore;
    class Player extends fCore.Node {
        constructor() {
            super("PlayerMain");
            let mesh = new fCore.MeshTorus("Torus");
            let cmpMaterial = new fCore.ComponentMaterial(spaceInvaders.materialGreen);
            this.addComponent(new fCore.ComponentTransform());
            this.addComponent(new fCore.ComponentMesh(mesh));
            this.addComponent(cmpMaterial);
            this.mtxLocal.scale(new fCore.Vector3(0.2, 0.2, 0.2));
            this.mtxLocal.translateY(-4);
        }
    }
    spaceInvaders.Player = Player;
})(spaceInvaders || (spaceInvaders = {}));
//# sourceMappingURL=Player.js.map