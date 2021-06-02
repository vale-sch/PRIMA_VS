"use strict";
var basketBallBattleRoyale;
(function (basketBallBattleRoyale) {
    var fCore = FudgeCore;
    let cmpCamera;
    let rootGraph;
    let canvas;
    let viewport;
    window.addEventListener("load", start);
    async function start(_event) {
        await fCore.Project.loadResourcesFromHTML();
        //fCore.Debug.log("Project:", fCore.Project.resources);
        rootGraph = fCore.Project.resources["Graph|2021-06-02T10:15:15.171Z|84209"];
        cmpCamera = new fCore.ComponentCamera();
        cmpCamera.clrBackground = fCore.Color.CSS("DEEPSKYBLUE");
        cmpCamera.mtxPivot.translateY(50);
        cmpCamera.mtxPivot.rotateX(90);
        createRigidbodies();
        canvas = document.querySelector("canvas");
        viewport = new fCore.Viewport();
        viewport.initialize("Viewport", rootGraph, cmpCamera, canvas);
        //Hud.start();
        fCore.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        fCore.Loop.start(fCore.LOOP_MODE.TIME_REAL, 60);
    }
    function update() {
        viewport.draw();
        ƒ.Physics.world.simulate(ƒ.Loop.timeFrameReal / 1000);
        if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.T]))
            fCore.Physics.settings.debugMode = fCore.Physics.settings.debugMode == fCore.PHYSICS_DEBUGMODE.JOINTS_AND_COLLIDER ? fCore.PHYSICS_DEBUGMODE.PHYSIC_OBJECTS_ONLY : fCore.PHYSICS_DEBUGMODE.JOINTS_AND_COLLIDER;
        if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.Y]))
            fCore.Physics.settings.debugDraw = !fCore.Physics.settings.debugDraw;
    }
    function createRigidbodies() {
        let floorContainer = rootGraph.getChild(0).getChild(0).getChild(0);
        for (let staticThing of floorContainer.getChildren()) {
            let cmpRigidbody = new fCore.ComponentRigidbody(0, fCore.PHYSICS_TYPE.STATIC, fCore.COLLIDER_TYPE.CUBE, fCore.PHYSICS_GROUP.DEFAULT);
            staticThing.addComponent(new fCore.ComponentTransform);
            staticThing.addComponent(cmpRigidbody);
        }
        fCore.Physics.adjustTransforms(rootGraph, true);
    }
})(basketBallBattleRoyale || (basketBallBattleRoyale = {}));
//# sourceMappingURL=Main.js.map