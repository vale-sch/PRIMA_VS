"use strict";
var SpaceInvaders;
(function (SpaceInvaders) {
    var fCore = FudgeCore;
    class Protection extends fCore.Node {
        constructor(_x) {
            super("Protection" + _x);
            let quads = new fCore.MeshQuad("Quads");
            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 5; j++) {
                    let childNodeQuadStripe = new fCore.Node("childNodeQuadStripe");
                    let randomMaterial = new fCore.Material("Green", fCore.ShaderUniColor, new fCore.CoatColored(new fCore.Color(Math.random(), Math.random(), Math.random(), 1)));
                    let cmpMaterialQuad = new fCore.ComponentMaterial(randomMaterial);
                    childNodeQuadStripe.addComponent(new fCore.ComponentMesh(quads));
                    childNodeQuadStripe.addComponent(new fCore.ComponentTransform());
                    childNodeQuadStripe.mtxLocal.translateX(i / 10);
                    childNodeQuadStripe.mtxLocal.translateY(j / 10);
                    childNodeQuadStripe.addComponent(cmpMaterialQuad);
                    childNodeQuadStripe.getComponent(fCore.ComponentMesh).mtxPivot.scale(new fCore.Vector3(0.2, 0.2, 0.2));
                    this.appendChild(childNodeQuadStripe);
                }
            }
            this.addComponent(new fCore.ComponentTransform());
            this.mtxLocal.scale(new fCore.Vector3(0.2, 0.2, 0.2));
            this.mtxLocal.translateY(-2);
            this.mtxLocal.translateX(-10);
            this.mtxLocal.translateX(_x);
        }
    }
    SpaceInvaders.Protection = Protection;
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=Protection.js.map