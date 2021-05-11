"use strict";
var SpaceInvaders;
(function (SpaceInvaders) {
    var fCore = FudgeCore;
    class QuadNode extends fCore.Node {
        constructor(_name, _pos, _scale) {
            super(_name);
            let randomColorMat = new fCore.Material("randomMaterial", fCore.ShaderUniColor, new fCore.CoatColored(new fCore.Color(Math.random(), Math.random(), Math.random(), 1)));
            this.addComponent(new fCore.ComponentTransform());
            this.mtxLocal.translateX(_pos.x);
            this.mtxLocal.translateY(_pos.y);
            let cmpMesh = new fCore.ComponentMesh(QuadNode.mesh);
            cmpMesh.mtxPivot.scaleX(_scale.x);
            cmpMesh.mtxPivot.scaleY(_scale.y);
            if (_name != "Protection")
                this.addComponent(cmpMesh);
            this.addComponent(new fCore.ComponentMaterial(randomColorMat));
        }
    }
    QuadNode.mesh = new fCore.MeshQuad("Quad");
    SpaceInvaders.QuadNode = QuadNode;
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=QuadNode.js.map