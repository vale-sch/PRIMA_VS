namespace SpaceInvaders {
    import fCore = FudgeCore;
    export class Protection extends fCore.Node {
        constructor(_x: number) {
            super("Protection" + _x);
            let quads: fCore.Mesh = new fCore.MeshQuad("Quads");


            for (let i: number = 0; i < 5; i++) {
                for (let j: number = 0; j < 5; j++) {
                    let childNodeQuadStripe: fCore.Node = new fCore.Node("childNodeQuadStripe");
                    let randomMaterial: fCore.Material = new fCore.Material("Green", fCore.ShaderUniColor, new fCore.CoatColored(new fCore.Color(Math.random(), Math.random(), Math.random(), 1)));
                    let cmpMaterialQuad: fCore.ComponentMaterial = new fCore.ComponentMaterial(randomMaterial);
                    childNodeQuadStripe.addComponent(new fCore.ComponentMesh(quads));
                    childNodeQuadStripe.addComponent(new fCore.ComponentTransform());

                    childNodeQuadStripe.getComponent(fCore.ComponentMesh).mtxPivot.scale(new fCore.Vector3(0.2, 0.2, 0.2));
                    childNodeQuadStripe.mtxLocal.translateX(i / 10);
                    childNodeQuadStripe.mtxLocal.translateY(j / 10);


                    childNodeQuadStripe.addComponent(cmpMaterialQuad);
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
}
