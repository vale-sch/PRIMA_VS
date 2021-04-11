
namespace SpaceInvaders {
    import fCore = FudgeCore;

    export class QuadNode extends fCore.Node {
        public rect: fCore.Rectangle;
        public quad: fCore.Mesh = new fCore.MeshQuad();
        public cmpQuad: fCore.ComponentMesh = new fCore.ComponentMesh(this.quad);
        constructor(_name: string, _pos: fCore.Vector2, _scale: fCore.Vector2) {
            super(_name);
            let randomColorMat: fCore.Material = new fCore.Material("randomMaterial", fCore.ShaderUniColor, new fCore.CoatColored(new fCore.Color(Math.random(), Math.random(), Math.random(), 1)));

            this.addComponent(new fCore.ComponentTransform());
            this.mtxLocal.translateX(_pos.x);
            this.mtxLocal.translateY(_pos.y);


            this.cmpQuad.mtxPivot.scaleX(_scale.x);
            this.cmpQuad.mtxPivot.scaleY(_scale.y);


            if (this.name != "Invader" && this.name != "ProtectionStripe") {
                this.rect = new fCore.Rectangle(_pos.x, _pos.y, _scale.x, _scale.y, fCore.ORIGIN2D.CENTER);

            } else if (this.name == "Invader")
                this.rect = new fCore.Rectangle(_pos.x - 1.675, _pos.y + 0.85, _scale.x, _scale.y, fCore.ORIGIN2D.CENTER);
            else if (this.name == "ProtectionStripe") {
                this.rect = new fCore.Rectangle(_pos.x, _pos.y - 0.5, _scale.x, _scale.y, fCore.ORIGIN2D.CENTER);
            }
            this.addComponent(this.cmpQuad);
            this.addComponent(new fCore.ComponentMaterial(randomColorMat));
        }

        public checkCollision(_target: QuadNode): boolean {
            return this.rect.collides(_target.rect);
        }
        public setRectPosition(): void {
            this.rect.position.x = this.mtxWorld.translation.x;
            this.rect.position.y = this.mtxWorld.translation.y;
        }
    }
}