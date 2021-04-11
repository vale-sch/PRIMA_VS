"use strict";
var SpaceInvaders;
(function (SpaceInvaders) {
    var fCore = FudgeCore;
    class QuadNode extends fCore.Node {
        constructor(_name, _pos, _scale) {
            super(_name);
            this.quad = new fCore.MeshQuad();
            this.cmpQuad = new fCore.ComponentMesh(this.quad);
            let randomColorMat = new fCore.Material("randomMaterial", fCore.ShaderUniColor, new fCore.CoatColored(new fCore.Color(Math.random(), Math.random(), Math.random(), 1)));
            this.addComponent(new fCore.ComponentTransform());
            this.mtxLocal.translateX(_pos.x);
            this.mtxLocal.translateY(_pos.y);
            this.cmpQuad.mtxPivot.scaleX(_scale.x);
            this.cmpQuad.mtxPivot.scaleY(_scale.y);
            if (this.name != "Invader" && this.name != "ProtectionStripe") {
                this.rect = new fCore.Rectangle(_pos.x, _pos.y, _scale.x, _scale.y, fCore.ORIGIN2D.CENTER);
            }
            else if (this.name == "Invader")
                this.rect = new fCore.Rectangle(_pos.x - 1.675, _pos.y + 0.85, _scale.x, _scale.y, fCore.ORIGIN2D.CENTER);
            else if (this.name == "ProtectionStripe") {
                this.rect = new fCore.Rectangle(_pos.x, _pos.y - 0.5, _scale.x, _scale.y, fCore.ORIGIN2D.CENTER);
            }
            this.addComponent(this.cmpQuad);
            this.addComponent(new fCore.ComponentMaterial(randomColorMat));
        }
        checkCollision(_target) {
            return this.rect.collides(_target.rect);
        }
        setRectPosition() {
            this.rect.position.x = this.mtxWorld.translation.x;
            this.rect.position.y = this.mtxWorld.translation.y;
        }
    }
    SpaceInvaders.QuadNode = QuadNode;
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=QuadNode.js.map