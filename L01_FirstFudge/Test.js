"use strict";
var L01_FirstFudge;
(function (L01_FirstFudge) {
    var fCore = FudgeCore;
    window.addEventListener("load", hndLoad);
    function hndLoad(_event) {
        const canvas = document.querySelector("canvas");
        fCore.Debug.log(canvas);
        let node = new fCore.Node("Quad");
        let mesh = new fCore.MeshQuad();
        let cmpMesh = new fCore.ComponentMesh(mesh);
        node.addComponent(cmpMesh);
        let mtrSolidWhite = new fCore.Material("SolidWhite", fCore.ShaderUniColor, new fCore.CoatColored(fCore.Color.CSS("WHITE")));
        let cmpMaterial = new fCore.ComponentMaterial(mtrSolidWhite);
        node.addComponent(cmpMaterial);
        let cmpCamera = new fCore.ComponentCamera();
        //cmpCamera.pivot.translateZ(2);
        //cmpCamera.pivot.rotateY(180);
        L01_FirstFudge.viewport = new fCore.Viewport();
        L01_FirstFudge.viewport.initialize("Viewport", node, cmpCamera, canvas);
        fCore.Debug.log(L01_FirstFudge.viewport);
        L01_FirstFudge.viewport.draw();
    }
})(L01_FirstFudge || (L01_FirstFudge = {}));
//# sourceMappingURL=Test.js.map