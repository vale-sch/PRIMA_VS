namespace FirstEditorGame {
    window.addEventListener("load", init);
    import fCore = FudgeCore;
    function init(_event: Event): void {
        // pick the graph to show
        let graph: any = "Graph|2021-04-27T14:40:53.087Z|90590";
        // setup the viewport
        let cmpCamera: fCore.ComponentCamera = new FudgeCore.ComponentCamera();
        let canvas: HTMLCanvasElement = document.querySelector("canvas");
        let viewport: fCore.Viewport = new FudgeCore.Viewport();
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
}

