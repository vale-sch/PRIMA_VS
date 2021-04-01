"use strict";
var SpaceInvaders;
(function (SpaceInvaders) {
    var fCore = FudgeCore;
    class Protection extends fCore.Node {
        constructor(_x) {
            super("Protection" + _x);
            let quads = new fCore.MeshQuad("Quads");
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    let childNodeQuadStripe = new fCore.Node("childNodeQuadStripe");
                    let randomMaterial = new fCore.Material("RandomColor", fCore.ShaderUniColor, new fCore.CoatColored(new fCore.Color(Math.random(), Math.random(), Math.random(), 1)));
                    let cmpMaterialQuad = new fCore.ComponentMaterial(randomMaterial);
                    childNodeQuadStripe.addComponent(cmpMaterialQuad);
                    childNodeQuadStripe.addComponent(new fCore.ComponentMesh(quads));
                    childNodeQuadStripe.addComponent(new fCore.ComponentTransform());
                    childNodeQuadStripe.mtxLocal.translateX(i / 3);
                    childNodeQuadStripe.mtxLocal.translateY(j / 3);
                    childNodeQuadStripe.getComponent(fCore.ComponentMesh).mtxPivot.scale(new fCore.Vector3(0.3, 0.3, 0.3));
                    this.appendChild(childNodeQuadStripe);
                }
            }
            this.addComponent(new fCore.ComponentTransform());
            this.mtxLocal.translateY(-2.5);
            this.mtxLocal.translateX(-10.5);
            this.mtxLocal.translateX(_x);
        }
    }
    SpaceInvaders.Protection = Protection;
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=Protection.js.map