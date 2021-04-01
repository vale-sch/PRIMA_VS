"use strict";
var spaceInvaders;
(function (spaceInvaders) {
    var fCore = FudgeCore;
    class LastEnemy extends fCore.Node {
        constructor() {
            super("LastEnemy");
            let pyramideEnemy = new fCore.MeshPyramid("Pyramide");
            let cmpMaterialQuad = new fCore.ComponentMaterial(spaceInvaders.materialRed);
            this.addComponent(new fCore.ComponentMesh(pyramideEnemy));
            this.addComponent(new fCore.ComponentTransform());
            this.addComponent(cmpMaterialQuad);
            this.mtxLocal.scale(new fCore.Vector3(0.25, 0.25, 0.25));
            this.mtxLocal.translateY(3.5);
            this.mtxLocal.rotateX(180);
        }
    }
    spaceInvaders.LastEnemy = LastEnemy;
})(spaceInvaders || (spaceInvaders = {}));
//# sourceMappingURL=LastEnemy.js.map