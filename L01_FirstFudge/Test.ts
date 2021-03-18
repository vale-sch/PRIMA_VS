namespace L01_FirstFudge {
    import fCore = FudgeCore;

    window.addEventListener("load", hndLoad);
    export let viewport: fCore.Viewport;

    function hndLoad(_event: Event): void {
        const canvas: HTMLCanvasElement = document.querySelector("canvas");
        fCore.Debug.log(canvas);

        let node: fCore.Node = new fCore.Node("Quad");

        let mesh: fCore.MeshQuad = new fCore.MeshQuad();
        let cmpMesh: fCore.ComponentMesh = new fCore.ComponentMesh(mesh);
        node.addComponent(cmpMesh);

        let mtrSolidWhite: fCore.Material = new fCore.Material("SolidWhite", fCore.ShaderUniColor, new fCore.CoatColored(fCore.Color.CSS("WHITE")));
        let cmpMaterial: fCore.ComponentMaterial = new fCore.ComponentMaterial(mtrSolidWhite);
        node.addComponent(cmpMaterial);

        let cmpCamera: fCore.ComponentCamera = new fCore.ComponentCamera();
        cmpCamera.mtxPivot.translateZ(2);
        cmpCamera.mtxPivot.rotateY(180);

        viewport = new fCore.Viewport();
        viewport.initialize("Viewport", node, cmpCamera, canvas);
        fCore.Debug.log(viewport);

        viewport.draw();
    }
}