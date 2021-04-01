namespace SpaceInvaders {
    import fCore = FudgeCore;
    export class Protection extends fCore.Node {
        constructor(_x: number) {
            super("Protection" + _x);
            let quads: fCore.Mesh = new fCore.MeshQuad("Quads");
            for (let i: number = 0; i < 4; i++) {
                for (let j: number = 0; j < 4; j++) {
                    let childNodeQuadStripe: fCore.Node = new fCore.Node("childNodeQuadStripe");
                    let randomMaterial: fCore.Material = new fCore.Material("RandomColor", fCore.ShaderUniColor, new fCore.CoatColored(new fCore.Color(Math.random(), Math.random(), Math.random(), 1)));
                    let cmpMaterialQuad: fCore.ComponentMaterial = new fCore.ComponentMaterial(randomMaterial);
                    
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
}
