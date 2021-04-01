"use strict";
var SpaceInvaders;
(function (SpaceInvaders) {
    var fCore = FudgeCore;
    class LastEnemy extends fCore.Node {
        constructor() {
            super("LastEnemy");
            let materialRed = new fCore.Material("RedMaterial", fCore.ShaderUniColor, new fCore.CoatColored(new fCore.Color(1, 0, 0, 0.6)));
            let pyramideEnemy = new fCore.MeshPyramid("Pyramide");
            let cmpMaterialQuad = new fCore.ComponentMaterial(materialRed);
            this.addComponent(new fCore.ComponentMesh(pyramideEnemy));
            this.addComponent(new fCore.ComponentTransform());
            this.addComponent(cmpMaterialQuad);
            this.mtxLocal.scale(new fCore.Vector3(0.25, 0.25, 0.25));
            this.mtxLocal.translateY(3.5);
            this.mtxLocal.rotateX(180);
        }
    }
    SpaceInvaders.LastEnemy = LastEnemy;
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=LastEnemy.js.map