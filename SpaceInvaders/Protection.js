"use strict";
var SpaceInvaders;
(function (SpaceInvaders) {
    var fCore = FudgeCore;
    class Protection extends SpaceInvaders.QuadNode {
        constructor(_x) {
            super("Protection", new fCore.Vector2(_x, -2.5), new fCore.Vector2(1, 1));
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
            this.mtxLocal.translateX(-10.5);
        }
    }
    SpaceInvaders.Protection = Protection;
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=Protection.js.map