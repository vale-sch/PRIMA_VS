namespace SpaceInvaders {
    import fCore = FudgeCore;
    export class QuadNode extends fCore.Node {
        static mesh: fCore.Mesh = new fCore.MeshQuad("Quad");


        constructor(_name: string, _pos: fCore.Vector2, _scale: fCore.Vector2) {
            super(_name);
            let randomColorMat: fCore.Material = new fCore.Material("randomMaterial", fCore.ShaderUniColor, new fCore.CoatColored(new fCore.Color(Math.random(), Math.random(), Math.random(), 1)));


            this.addComponent(new fCore.ComponentTransform());
            this.mtxLocal.translateX(_pos.x);
            this.mtxLocal.translateY(_pos.y);

            let cmpMesh: fCore.ComponentMesh = new fCore.ComponentMesh(QuadNode.mesh);
            cmpMesh.mtxPivot.scaleX(_scale.x);
            cmpMesh.mtxPivot.scaleY(_scale.y);
            if (_name != "Protection")
                this.addComponent(cmpMesh);
            this.addComponent(new fCore.ComponentMaterial(randomColorMat));
        }


    }




}