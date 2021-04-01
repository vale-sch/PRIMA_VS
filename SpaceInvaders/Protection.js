"use strict";
var SpaceInvaders;
(function (SpaceInvaders) {
    var fCore = FudgeCore;
    class Protection extends fCore.Node {
        constructor(_x) {
            super("Protection" + _x);
            let quads = new fCore.MeshQuad("Quads");
            let cmpMaterialQuad = new fCore.ComponentMaterial(SpaceInvaders.materialGreen);
            this.addComponent(new fCore.ComponentMesh(quads));
            this.addComponent(new fCore.ComponentTransform());
            this.addComponent(cmpMaterialQuad);
            this.mtxLocal.scale(new fCore.Vector3(0.2, 0.2, 0.2));
            this.mtxLocal.translateY(-2);
            this.mtxLocal.translateX(-10);
            this.mtxLocal.translateX(_x);
        }
    }
    SpaceInvaders.Protection = Protection;
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=Protection.js.map