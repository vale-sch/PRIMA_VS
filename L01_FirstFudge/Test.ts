namespace L01_FirstFudge {
    import fCore = FudgeCore;
    window.addEventListener("load", init);
    let node: fCore.Node = new fCore.Node("Test");
    let viewport: fCore.Viewport = new fCore.Viewport();

    function init(_event: Event): void {
        let canvas: HTMLCanvasElement = document.querySelector("canvas");
       
        node.addComponent(new fCore.ComponentTransform());
       
        let mesh: fCore.Mesh = new fCore.MeshQuad("Quad");
        node.addComponent(new fCore.ComponentMesh(mesh));

        let material: fCore.Material = new fCore.Material("FirstMaterial", fCore.ShaderUniColor, new fCore.CoatColored(new fCore.Color(1, 1, 1, 1)));
        let cmpMaterial: fCore.ComponentMaterial = new fCore.ComponentMaterial(material);        
        node.addComponent(cmpMaterial);

        let cmpCamera: fCore.ComponentCamera = new fCore.ComponentCamera();
        cmpCamera.mtxPivot.translateZ(3);
        cmpCamera.mtxPivot.rotateY(180);

        viewport.initialize("Viewport", node, cmpCamera, canvas);
        viewport.draw();

        fCore.Loop.start(fCore.LOOP_MODE.TIME_REAL, 60);
        fCore.Loop.addEventListener(fCore.EVENT.LOOP_FRAME, update);
    }
    function update(_event: Event): void {
        let rotSpeed: number = 90 / 1000;
        let deltaTime: number = fCore.Loop.timeFrameReal / 1000;
        node.getComponent(fCore.ComponentMesh).mtxPivot.rotateZ(rotSpeed * deltaTime);
        viewport.draw();
    }
}