namespace SpaceInvaders {
    import fCore = FudgeCore;

    export class QuadNode extends fCore.Node {
        public rect: fCore.Rectangle;
        constructor(_name: string, _pos: fCore.Vector2, _scale: fCore.Vector2) {
            super(_name);
            let randomColorMat: fCore.Material = new fCore.Material("randomMaterial", fCore.ShaderUniColor, new fCore.CoatColored(new fCore.Color(Math.random(), Math.random(), Math.random(), 1)));

            this.addComponent(new fCore.ComponentTransform());
            this.mtxLocal.translateX(_pos.x);
            this.mtxLocal.translateY(_pos.y);
            let quad: fCore.Mesh = new fCore.MeshQuad();
            let cmpMesh: fCore.ComponentMesh = new fCore.ComponentMesh(quad);
            cmpMesh.mtxPivot.scaleX(_scale.x);
            cmpMesh.mtxPivot.scaleY(_scale.y);
            if (_name != "Protection")
                this.addComponent(cmpMesh);
            this.addComponent(new fCore.ComponentMaterial(randomColorMat));
        }
        /* public checkCollision(_target: QuadNode): boolean {
             let intersection: fCore.Rectangle = this.rect.getIntersection(_target.rect);
 
             return intersection != null;
         }
         public setRectPosition(): void {
             this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
             this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
         }*/
    }

}