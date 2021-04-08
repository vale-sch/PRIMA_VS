"use strict";
var SpaceInvaders;
(function (SpaceInvaders) {
    var fCore = FudgeCore;
    class QuadNode extends fCore.Node {
        constructor(_name, _pos, _scale) {
            super(_name);
            let randomColorMat = new fCore.Material("randomMaterial", fCore.ShaderUniColor, new fCore.CoatColored(new fCore.Color(Math.random(), Math.random(), Math.random(), 1)));
            this.rect = new fCore.Rectangle(_pos.x, _pos.y, _scale.x, _scale.y, fCore.ORIGIN2D.CENTER);
            this.addComponent(new fCore.ComponentTransform());
            this.mtxLocal.translateX(_pos.x);
            this.mtxLocal.translateY(_pos.y);
            let quad = new fCore.MeshQuad();
            let cmpQuad = new fCore.ComponentMesh(quad);
            cmpQuad.mtxPivot.scaleX(_scale.x);
            cmpQuad.mtxPivot.scaleY(_scale.y);
            if (_name != "Protection")
                this.addComponent(cmpQuad);
            this.addComponent(new fCore.ComponentMaterial(randomColorMat));
        }
        checkCollision(_target) {
            return this.rect.collides(_target.rect);
        }
        setRectPosition() {
            // this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 10;
            //this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 10;
        }
    }
    SpaceInvaders.QuadNode = QuadNode;
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=QuadNode.js.map