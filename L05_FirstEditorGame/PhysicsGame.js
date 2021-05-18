"use strict";
var L05_PhysicsGame;
(function (L05_PhysicsGame) {
    var fCore = FudgeCore;
    // import fAid = FudgeAid;
    let audioBackground = new fCore.Audio("./music/backgroundmusic.mp3");
    let audioGrab = new fCore.Audio("./music/grab.wav");
    let audioShoot = new fCore.Audio("./music/shoot.wav");
    let cmpCamera;
    let cmpAvatar;
    let cmpRigidbodyBall;
    let cmpAudioGrab = new fCore.ComponentAudio(audioGrab);
    let cmpAudioShoot = new fCore.ComponentAudio(audioShoot);
    let ball;
    let avatarNode;
    let childAvatarNode;
    let rootGraph;
    let viewport;
    let forwardMovement = 0;
    let backwardMovement = 0;
    let movementspeed = 12;
    let turningspeed = 8;
    let playerJumpForce = 2000;
    let kickStrength = 750;
    let distance;
    let mouseMove = new fCore.Vector2();
    let isGrounded;
    let isGrabbed;
    let isMouseMooving;
    window.addEventListener("load", start);
    window.addEventListener("mousemove", onMouseMove);
    async function start(_event) {
        await FudgeCore.Project.loadResourcesFromHTML();
        // await FudgeCore.Project.loadResources("PhysicsGame.json");
        FudgeCore.Debug.log("Project:", FudgeCore.Project.resources);
        // pick the graph to show
        rootGraph = FudgeCore.Project.resources["Graph|2021-04-27T14:37:42.239Z|64317"];
        cmpCamera = new fCore.ComponentCamera();
        cmpCamera.clrBackground = fCore.Color.CSS("DEEPSKYBLUE");
        cmpCamera.mtxPivot.translateY(1);
        cmpCamera.mtxPivot.rotateX(10);
        createAvatar();
        setupAudio();
        createRigidbodies();
        let canvas = document.querySelector("canvas");
        viewport = new fCore.Viewport();
        viewport.initialize("Viewport", rootGraph, cmpCamera, canvas);
        fCore.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        fCore.Loop.start(fCore.LOOP_MODE.TIME_REAL, 60);
    }
    function createAvatar() {
        cmpAvatar = new fCore.ComponentRigidbody(75, fCore.PHYSICS_TYPE.DYNAMIC, fCore.COLLIDER_TYPE.CAPSULE, fCore.PHYSICS_GROUP.DEFAULT);
        cmpAvatar.restitution = 0.5;
        cmpAvatar.rotationInfluenceFactor = fCore.Vector3.ZERO();
        cmpAvatar.friction = 1;
        avatarNode = new fCore.Node("AvatarNode");
        avatarNode.addComponent(new fCore.ComponentTransform(fCore.Matrix4x4.TRANSLATION(fCore.Vector3.Y(3))));
        avatarNode.addComponent(cmpAvatar);
        avatarNode.addComponent(cmpCamera);
        childAvatarNode = new fCore.Node("childAvatarNode");
        childAvatarNode.addComponent(new fCore.ComponentTransform());
        childAvatarNode.mtxLocal.translate(new fCore.Vector3(0, 0.75, 5));
        avatarNode.appendChild(childAvatarNode);
        rootGraph.appendChild(avatarNode);
    }
    function setupAudio() {
        // setup audio
        let cmpListener = new ƒ.ComponentAudioListener();
        cmpCamera.getContainer().addComponent(cmpListener);
        let audioNode = new fCore.Node("audioNode");
        let cmpAudioBackground = new fCore.ComponentAudio(audioBackground, true, true);
        cmpAudioBackground.volume = 0.2;
        audioNode.addComponent(cmpAudioBackground);
        audioNode.addComponent(cmpAudioGrab);
        audioNode.addComponent(cmpAudioShoot);
        avatarNode.appendChild(audioNode);
        FudgeCore.AudioManager.default.listenWith(cmpListener);
        FudgeCore.AudioManager.default.listenTo(audioNode);
    }
    function update() {
        fCore.Physics.world.simulate(fCore.Loop.timeFrameReal / 1000);
        playerIsGroundedRaycast();
        isGrabbingObjects();
        handleKeys(fCore.Loop.timeFrameReal / 1000);
        player_Movement(fCore.Loop.timeFrameReal / 1000);
        viewport.draw();
        fCore.AudioManager.default.update();
        if (!isMouseMooving)
            mouseMove = fCore.Vector2.ZERO();
        isMouseMooving = false;
        if (ball != undefined)
            if (ball.mtxWorld.translation.y < 0) {
                cmpRigidbodyBall.setVelocity(fCore.Vector3.ZERO());
                cmpRigidbodyBall.setRotation(fCore.Vector3.ZERO());
                cmpRigidbodyBall.setPosition(new fCore.Vector3(0, 4, 0));
                ball.mtxWorld.translate(new fCore.Vector3(0, 4, 0));
            }
        if (avatarNode.mtxWorld.translation.y < 0) {
            cmpAvatar.setVelocity(fCore.Vector3.ZERO());
            cmpAvatar.setRotation(fCore.Vector3.ZERO());
            cmpAvatar.setPosition(new fCore.Vector3(0, 4, 0));
            avatarNode.mtxWorld.translate(new fCore.Vector3(0, 4, 0));
        }
        if (isGrabbed) {
            cmpRigidbodyBall.setVelocity(fCore.Vector3.ZERO());
            cmpRigidbodyBall.setRotation(fCore.Vector3.ZERO());
            cmpRigidbodyBall.setPosition(childAvatarNode.mtxWorld.translation);
            ball.mtxWorld.translate(childAvatarNode.mtxWorld.translation);
        }
    }
    function createRigidbodies() {
        let level = rootGraph.getChildrenByName("level")[0];
        for (let node of level.getChildren()) {
            let cmpRigidbody = new fCore.ComponentRigidbody(0, fCore.PHYSICS_TYPE.STATIC, fCore.COLLIDER_TYPE.CUBE, fCore.PHYSICS_GROUP.DEFAULT);
            node.addComponent(cmpRigidbody);
        }
        ball = rootGraph.getChildrenByName("ball")[0];
        cmpRigidbodyBall = new fCore.ComponentRigidbody(25, fCore.PHYSICS_TYPE.DYNAMIC, fCore.COLLIDER_TYPE.SPHERE, fCore.PHYSICS_GROUP.GROUP_2);
        ball.addComponent(cmpRigidbodyBall);
        fCore.Physics.adjustTransforms(rootGraph, true);
    }
    function handleKeys(_deltaTime) {
        if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.W, fCore.KEYBOARD_CODE.ARROW_UP]))
            forwardMovement = 1.33;
        else if (forwardMovement >= 0)
            forwardMovement -= _deltaTime * 2;
        if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.S, fCore.KEYBOARD_CODE.ARROW_DOWN]))
            backwardMovement = -1.33;
        else if (backwardMovement <= 0)
            backwardMovement += _deltaTime * 2;
        if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.SPACE]))
            if (isGrounded)
                cmpAvatar.applyLinearImpulse(new fCore.Vector3(0, playerJumpForce, 0));
        if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.T]))
            fCore.Physics.settings.debugMode = fCore.Physics.settings.debugMode == fCore.PHYSICS_DEBUGMODE.JOINTS_AND_COLLIDER ? fCore.PHYSICS_DEBUGMODE.PHYSIC_OBJECTS_ONLY : fCore.PHYSICS_DEBUGMODE.JOINTS_AND_COLLIDER;
        if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.Y]))
            fCore.Physics.settings.debugDraw = !fCore.Physics.settings.debugDraw;
    }
    function player_Movement(_deltaTime) {
        let playerForward;
        playerForward = fCore.Vector3.Z();
        playerForward.transform(avatarNode.mtxWorld, false);
        let movementVelocity = new fCore.Vector3();
        movementVelocity.x = playerForward.x * (forwardMovement + backwardMovement) * movementspeed;
        movementVelocity.y = cmpAvatar.getVelocity().y;
        movementVelocity.z = playerForward.z * (forwardMovement + backwardMovement) * movementspeed;
        cmpAvatar.rotateBody(new fCore.Vector3(0, -mouseMove.x * turningspeed * _deltaTime, 0));
        cmpAvatar.setVelocity(movementVelocity);
    }
    function onMouseMove(_event) {
        mouseMove = new fCore.Vector2(_event.movementX, _event.movementY);
        isMouseMooving = true;
    }
    function isGrabbingObjects() {
        if (cmpRigidbodyBall != undefined) {
            if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.E])) {
                distance = fCore.Vector3.DIFFERENCE(ball.mtxWorld.translation, avatarNode.mtxWorld.translation);
                if (distance.magnitude > 4)
                    return;
                cmpAudioGrab.play(true);
                cmpRigidbodyBall.setVelocity(fCore.Vector3.ZERO());
                cmpRigidbodyBall.setRotation(fCore.Vector3.ZERO());
                isGrabbed = true;
            }
            if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.R]) && isGrabbed == true) {
                cmpAudioShoot.play(true);
                isGrabbed = false;
                let playerForward;
                playerForward = fCore.Vector3.Z();
                playerForward.transform(avatarNode.mtxWorld, false);
                cmpRigidbodyBall.applyImpulseAtPoint(new fCore.Vector3(playerForward.x * kickStrength, playerForward.y * 5 * kickStrength, playerForward.z * kickStrength), avatarNode.mtxWorld.translation);
            }
        }
    }
    function playerIsGroundedRaycast() {
        let hitInfo;
        hitInfo = fCore.Physics.raycast(cmpAvatar.getPosition(), new fCore.Vector3(0, -1, 0), 1.1);
        if (hitInfo.hit)
            isGrounded = true;
        else
            isGrounded = false;
    }
})(L05_PhysicsGame || (L05_PhysicsGame = {}));
//# sourceMappingURL=PhysicsGame.js.map