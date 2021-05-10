"use strict";
var L05_PhysicsGame;
(function (L05_PhysicsGame) {
    var fCore = FudgeCore;
    // import fAid = FudgeAid;
    let root;
    let cmpAvatar;
    let cmpRigidbodyBall;
    let ball;
    let avatarNode;
    let childAvatarNode;
    let viewport;
    let cmpCamera;
    let yTurn = 0;
    let forwardMovement = 0;
    let movementspeed = 12;
    let turningspeed = 200;
    let playerJumpForce = 2000;
    let isGrounded;
    let distance;
    let kickStrength = 750;
    let isGrabbed;
    window.addEventListener("load", start);
    async function start(_event) {
        await FudgeCore.Project.loadResourcesFromHTML();
        // await FudgeCore.Project.loadResources("PhysicsGame.json");
        FudgeCore.Debug.log("Project:", FudgeCore.Project.resources);
        // pick the graph to show
        root = FudgeCore.Project.resources["Graph|2021-04-27T14:37:42.239Z|64317"];
        cmpCamera = new fCore.ComponentCamera();
        cmpCamera.clrBackground = fCore.Color.CSS("DEEPSKYBLUE");
        cmpCamera.mtxPivot.translateY(1);
        cmpCamera.mtxPivot.rotateX(10);
        createAvatar();
        createRigidbodies();
        let canvas = document.querySelector("canvas");
        viewport = new fCore.Viewport();
        viewport.initialize("Viewport", root, cmpCamera, canvas);
        document.addEventListener("keypress", grabObjects);
        document.addEventListener("keypress", handler_Key_Pressed);
        document.addEventListener("keyup", handler_Key_Released);
        //fCore.Loop.addEventListener(fCore.EVENT.LOOP_FRAME, update);
        //fCore.Loop.start();
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
        avatarNode.appendChild(childAvatarNode);
        childAvatarNode.addComponent(new fCore.ComponentTransform());
        childAvatarNode.mtxLocal.translate(new fCore.Vector3(0, 0.75, 5));
        root.appendChild(avatarNode);
    }
    function update() {
        fCore.Physics.world.simulate(fCore.Loop.timeFrameReal / 1000);
        playerIsGroundedRaycast();
        player_Movement(fCore.Loop.timeFrameReal / 1000);
        viewport.draw();
        if (ball == undefined)
            return;
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
        let level = root.getChildrenByName("level")[0];
        for (let node of level.getChildren()) {
            let cmpRigidbody = new fCore.ComponentRigidbody(0, fCore.PHYSICS_TYPE.STATIC, fCore.COLLIDER_TYPE.CUBE, fCore.PHYSICS_GROUP.DEFAULT);
            node.addComponent(cmpRigidbody);
        }
        ball = root.getChildrenByName("ball")[0];
        cmpRigidbodyBall = new fCore.ComponentRigidbody(25, fCore.PHYSICS_TYPE.DYNAMIC, fCore.COLLIDER_TYPE.SPHERE, fCore.PHYSICS_GROUP.GROUP_2);
        ball.addComponent(cmpRigidbodyBall);
        fCore.Physics.adjustTransforms(root, true);
    }
    function player_Movement(_deltaTime) {
        let playerForward;
        playerForward = fCore.Vector3.Z();
        playerForward.transform(avatarNode.mtxWorld, false);
        //You can rotate a body like you would rotate a transform, incremental but keep in mind, normally we use forces in physics,
        //this is just a feature to make it easier to create player characters
        cmpAvatar.rotateBody(new fCore.Vector3(0, yTurn * turningspeed * _deltaTime, 0));
        let movementVelocity = new fCore.Vector3();
        movementVelocity.x = playerForward.x * forwardMovement * movementspeed;
        movementVelocity.y = cmpAvatar.getVelocity().y;
        movementVelocity.z = playerForward.z * forwardMovement * movementspeed;
        cmpAvatar.setVelocity(movementVelocity);
    }
    function handler_Key_Pressed(_event) {
        if (_event.code == fCore.KEYBOARD_CODE.A)
            yTurn = 0.75;
        if (_event.code == fCore.KEYBOARD_CODE.W)
            forwardMovement = 1.33;
        if (_event.code == fCore.KEYBOARD_CODE.S)
            forwardMovement = -1.33;
        if (_event.code == fCore.KEYBOARD_CODE.D)
            yTurn = -0.75;
        if (_event.code == fCore.KEYBOARD_CODE.SPACE)
            if (isGrounded)
                cmpAvatar.applyLinearImpulse(new fCore.Vector3(0, playerJumpForce, 0));
        if (_event.code == fCore.KEYBOARD_CODE.T)
            fCore.Physics.settings.debugMode = fCore.Physics.settings.debugMode == fCore.PHYSICS_DEBUGMODE.JOINTS_AND_COLLIDER ? fCore.PHYSICS_DEBUGMODE.PHYSIC_OBJECTS_ONLY : fCore.PHYSICS_DEBUGMODE.JOINTS_AND_COLLIDER;
        if (_event.code == fCore.KEYBOARD_CODE.Y)
            fCore.Physics.settings.debugDraw = !fCore.Physics.settings.debugDraw;
    }
    function grabObjects(_event) {
        if (cmpRigidbodyBall != undefined) {
            if (_event.code == fCore.KEYBOARD_CODE.E) {
                distance = fCore.Vector3.DIFFERENCE(ball.mtxWorld.translation, avatarNode.mtxWorld.translation);
                if (distance.magnitude > 4)
                    return;
                cmpRigidbodyBall.setVelocity(fCore.Vector3.ZERO());
                cmpRigidbodyBall.setRotation(fCore.Vector3.ZERO());
                isGrabbed = true;
            }
            if (_event.code == fCore.KEYBOARD_CODE.R && isGrabbed == true) {
                isGrabbed = false;
                let playerForward;
                playerForward = fCore.Vector3.Z();
                playerForward.transform(avatarNode.mtxWorld, false);
                cmpRigidbodyBall.applyImpulseAtPoint(new fCore.Vector3(playerForward.x * kickStrength, playerForward.y * 5 * kickStrength, playerForward.z * kickStrength), avatarNode.mtxWorld.translation);
            }
        }
    }
    function handler_Key_Released(_event) {
        if (_event.code == fCore.KEYBOARD_CODE.A)
            yTurn = 0;
        if (_event.code == fCore.KEYBOARD_CODE.W)
            forwardMovement = 0;
        if (_event.code == fCore.KEYBOARD_CODE.S)
            forwardMovement = 0;
        if (_event.code == fCore.KEYBOARD_CODE.D)
            yTurn = 0;
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