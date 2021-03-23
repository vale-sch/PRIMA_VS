namespace L01_FirstFudge {
    import fCore = FudgeCore;
    window.addEventListener("load", init);

    function init(_event: Event): void {
        let node: fCore.Node = new fCore.Node("Test");
        let canvas: HTMLCanvasElement = document.querySelector("canvas");
        
        let mesh: fCore.MeshQuad = new fCore.MeshQuad("Quad");
        node.addComponent(new fCore.ComponentMesh(mesh));

        let material: fCore.Material = new fCore.Material("FirstMaterial", fCore.ShaderUniColor, new fCore.CoatColored(new fCore.Color(1, 1, 1, 1)));
        let cmpMaterial: fCore.ComponentMaterial = new fCore.ComponentMaterial(material);        
        node.addComponent(cmpMaterial);

        let cmpCamera: fCore.ComponentCamera = new fCore.ComponentCamera();
        cmpCamera.mtxPivot.translateZ(3);
        cmpCamera.mtxPivot.rotateY(180);

        let viewport: fCore.Viewport = new fCore.Viewport();
        viewport.initialize("Viewport", node, cmpCamera, canvas);
        viewport.draw();
    }
}