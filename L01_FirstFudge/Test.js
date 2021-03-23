"use strict";
var L01_FirstFudge;
(function (L01_FirstFudge) {
    var fCore = FudgeCore;
    window.addEventListener("load", init);
    function init(_event) {
        let node = new fCore.Node("Test");
        let canvas = document.querySelector("canvas");
        let mesh = new fCore.MeshQuad("Quad");
        node.addComponent(new fCore.ComponentMesh(mesh));
        let material = new fCore.Material("FirstMaterial", fCore.ShaderUniColor, new fCore.CoatColored(new fCore.Color(1, 1, 1, 1)));
        let cmpMaterial = new fCore.ComponentMaterial(material);
        node.addComponent(cmpMaterial);
        let cmpCamera = new fCore.ComponentCamera();
        cmpCamera.mtxPivot.translateZ(3);
        cmpCamera.mtxPivot.rotateY(180);
        let viewport = new fCore.Viewport();
        viewport.initialize("Viewport", node, cmpCamera, canvas);
        viewport.draw();
    }
})(L01_FirstFudge || (L01_FirstFudge = {}));
//# sourceMappingURL=Test.js.map