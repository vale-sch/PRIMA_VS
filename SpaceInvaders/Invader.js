"use strict";
var spaceInvaders;
(function (spaceInvaders) {
    var fCore = FudgeCore;
    class Invader extends fCore.Node {
        constructor(_x, _y) {
            super("Invader" + (_x + _y));
            let quads = new fCore.MeshQuad("Quads");
            let cmpMaterialQuad = new fCore.ComponentMaterial(spaceInvaders.materialWhite);
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
    spaceInvaders.Invader = Invader;
})(spaceInvaders || (spaceInvaders = {}));
//# sourceMappingURL=Invader.js.map