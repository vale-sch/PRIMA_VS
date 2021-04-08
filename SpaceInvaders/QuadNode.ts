namespace SpaceInvaders {
    import fCore = FudgeCore;

    export class QuadNode extends fCore.Node {
        public rect: fCore.Rectangle;
        constructor(_name: string, _pos: fCore.Vector2, _scale: fCore.Vector2) {
            super(_name);
            let randomColorMat: fCore.Material = new fCore.Material("randomMaterial", fCore.ShaderUniColor, new fCore.CoatColored(new fCore.Color(Math.random(), Math.random(), Math.random(), 1)));

            this.rect = new fCore.Rectangle(_pos.x, _pos.y, _scale.x, _scale.y, fCore.ORIGIN2D.CENTER);

            this.addComponent(new fCore.ComponentTransform());
            this.mtxLocal.translateX(_pos.x);
            this.mtxLocal.translateY(_pos.y);

            let quad: fCore.Mesh = new fCore.MeshQuad();
            let cmpQuad: fCore.ComponentMesh = new fCore.ComponentMesh(quad);
            cmpQuad.mtxPivot.scaleX(_scale.x);
            cmpQuad.mtxPivot.scaleY(_scale.y);
            if (_name != "Protection")
                this.addComponent(cmpQuad);
            this.addComponent(new fCore.ComponentMaterial(randomColorMat));
        }
        public checkCollision(_target: QuadNode): boolean {
            return this.rect.collides(_target.rect);
        }
        public setRectPosition(): void {
            // this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 10;
            //this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 10;
        }
    }
}