"use strict";
var L01_FirstFudge;
(function (L01_FirstFudge) {
    var fCore = FudgeCore;
    window.addEventListener("load", init);
    let node = new fCore.Node("Test");
    let viewport = new fCore.Viewport();
    function init(_event) {
        let canvas = document.querySelector("canvas");
        node.addComponent(new fCore.ComponentTransform());
        let mesh = new fCore.MeshQuad("Quad");
        node.addComponent(new fCore.ComponentMesh(mesh));
        let material = new fCore.Material("FirstMaterial", fCore.ShaderUniColor, new fCore.CoatColored(new fCore.Color(1, 1, 1, 1)));
        let cmpMaterial = new fCore.ComponentMaterial(material);
        node.addComponent(cmpMaterial);
        let cmpCamera = new fCore.ComponentCamera();
        cmpCamera.mtxPivot.translateZ(3);
        cmpCamera.mtxPivot.rotateY(180);
        viewport.initialize("Viewport", node, cmpCamera, canvas);
        viewport.draw();
        fCore.Loop.start(fCore.LOOP_MODE.TIME_REAL, 60);
        fCore.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
    }
    function update(_event) {
        let rotSpeed = 90 / 1000;
        let deltaTime = fCore.Loop.timeFrameReal / 1000;
        node.getComponent(fCore.ComponentMesh).mtxPivot.rotateZ(rotSpeed * deltaTime);
        viewport.draw();
    }
})(L01_FirstFudge || (L01_FirstFudge = {}));
//# sourceMappingURL=Test.js.map