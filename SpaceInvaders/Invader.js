"use strict";
var SpaceInvaders;
(function (SpaceInvaders) {
    var fCore = FudgeCore;
    class Invader extends fCore.Node {
        constructor(_x, _y) {
            super("Invader" + (_x + _y));
            let materialWhite = new fCore.Material("WhiteMaterial", fCore.ShaderUniColor, new fCore.CoatColored(new fCore.Color(1, 1, 1, 1)));
            let quads = new fCore.MeshQuad("Quads");
            let cmpMaterialQuad = new fCore.ComponentMaterial(materialWhite);
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
    SpaceInvaders.Invader = Invader;
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=Invader.js.map