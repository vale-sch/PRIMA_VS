"use strict";
var FirstEditorGame;
(function (FirstEditorGame) {
    window.addEventListener("load", init);
    function init(_event) {
        // pick the graph to show
        let graph = "Graph|2021-04-27T14:40:53.087Z|90590";
        // setup the viewport
        let cmpCamera = new FudgeCore.ComponentCamera();
        let canvas = document.querySelector("canvas");
        let viewport = new FudgeCore.Viewport();
        viewport.initialize("InteractiveViewport", graph, cmpCamera, canvas);
        FudgeCore.Debug.log("Viewport:", viewport);
        FudgeAid.Viewport.expandCameraToInteractiveOrbit(viewport);
        // setup audio
        let cmpListener = new ƒ.ComponentAudioListener();
        cmpCamera.getContainer().addComponent(cmpListener);
        FudgeCore.AudioManager.default.listenWith(cmpListener);
        FudgeCore.AudioManager.default.listenTo(graph);
        FudgeCore.Debug.log("Audio:", FudgeCore.AudioManager.default);
        // draw viewport once for immediate feedback
        viewport.draw();
        canvas.dispatchEvent(new CustomEvent("interactiveViewportStarted", { bubbles: true, detail: viewport }));
    }
})(FirstEditorGame || (FirstEditorGame = {}));
//# sourceMappingURL=Main.js.map