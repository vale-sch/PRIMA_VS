"use strict";
var basketBallBattleRoyale;
(function (basketBallBattleRoyale) {
    var fCore = FudgeCore;
    //Event Systems------------------------------------------------------------
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("pointerlockchange", pointerLockChange);
    window.addEventListener("mousemove", onMouseMove);
    let isPointerInGame;
    function onPointerDown(_event) {
        if (!isPointerInGame)
            basketBallBattleRoyale.canvas.requestPointerLock();
    }
    function pointerLockChange(_event) {
        if (!document.pointerLockElement)
            isPointerInGame = false;
        else
            isPointerInGame = true;
    }
    function onMouseMove(_event) {
        if (isPointerInGame) {
            //roatation for y axis on rgdbdy and mesh
            let rotFriction = 10;
            basketBallBattleRoyale.avatarNode.mtxLocal.rotateY(-_event.movementX / rotFriction);
            basketBallBattleRoyale.avatarNode.getComponent(fCore.ComponentRigidbody).rotateBody(fCore.Vector3.Y(-_event.movementX / rotFriction));
            //rotation for x axis on cmpCamera
            let topRotLock = -25;
            let botRotLock = 30;
            let rotateBackPower = 0.15;
            if (basketBallBattleRoyale.cmpCamera.mtxPivot.rotation.x >= topRotLock && basketBallBattleRoyale.cmpCamera.mtxPivot.rotation.x <= botRotLock)
                basketBallBattleRoyale.cmpCamera.mtxPivot.rotateX(_event.movementY / rotFriction);
            else if (basketBallBattleRoyale.cmpCamera.mtxPivot.rotation.x <= topRotLock)
                basketBallBattleRoyale.cmpCamera.mtxPivot.rotateX(rotateBackPower);
            else if (basketBallBattleRoyale.cmpCamera.mtxPivot.rotation.x >= topRotLock)
                basketBallBattleRoyale.cmpCamera.mtxPivot.rotateX(-rotateBackPower);
        }
    }
    //Event Systems------------------------------------------------------------
    fCore.Project.registerScriptNamespace(basketBallBattleRoyale);
    class AvatarController {
        constructor(_avatarsContainer, _collMeshesOfBasketTrigger, _players) {
            this.score = 10;
            this.forwardMovement = 0;
            this.backwardMovement = 0;
            this.movementspeed = 5;
            this.frictionFactor = 8;
            this.throwStrength = 510;
            this.update = () => {
                this.avatarMovement(fCore.Loop.timeFrameReal / 1000);
                this.handleInputAvatar(fCore.Loop.timeFrameReal / 1000);
                //player Grab function
                this.isGrabbingBasket();
                //sub functionality of isGrabbingObjects();
                if (this.isGrabbed) {
                    this.targetPlayersName = this.whichTargetToChooseAvatar();
                    basketBallBattleRoyale.basketBalls[0].getComponent(basketBallBattleRoyale.BasketBallsController).isInUse = true;
                    basketBallBattleRoyale.basketBalls[0].getComponent(fCore.ComponentRigidbody).setVelocity(fCore.Vector3.ZERO());
                    basketBallBattleRoyale.basketBalls[0].getComponent(fCore.ComponentRigidbody).setRotation(fCore.Vector3.ZERO());
                    basketBallBattleRoyale.basketBalls[0].getComponent(fCore.ComponentRigidbody).setPosition(this.childAvatarNode.mtxWorld.translation);
                    basketBallBattleRoyale.basketBalls[0].mtxWorld.translate(this.childAvatarNode.mtxWorld.translation);
                }
            };
            this.avatarsContainer = _avatarsContainer;
            this.collMeshesOfBasketTrigger = _collMeshesOfBasketTrigger;
            this.players = _players;
        }
        start() {
            this.createAvatar();
            console.log("Avatar is initialized!");
            fCore.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
            fCore.Loop.start(fCore.LOOP_MODE.TIME_REAL, 60);
        }
        createAvatar() {
            this.cmpAvatar = new fCore.ComponentRigidbody(75, fCore.PHYSICS_TYPE.DYNAMIC, fCore.COLLIDER_TYPE.CAPSULE, fCore.PHYSICS_GROUP.DEFAULT);
            this.cmpAvatar.restitution = 0.1;
            this.cmpAvatar.rotationInfluenceFactor = fCore.Vector3.ZERO();
            this.cmpAvatar.friction = 100;
            basketBallBattleRoyale.avatarNode = new fCore.Node("AvatarNode");
            basketBallBattleRoyale.avatarNode.addComponent(new fCore.ComponentTransform(fCore.Matrix4x4.TRANSLATION(fCore.Vector3.Y(0))));
            this.childAvatarNode = new fCore.Node("childAvatarNode");
            this.childAvatarNode.addComponent(new fCore.ComponentTransform());
            this.childAvatarNode.mtxLocal.translate(new fCore.Vector3(0, 1, 4.75));
            basketBallBattleRoyale.avatarNode.appendChild(this.childAvatarNode);
            basketBallBattleRoyale.avatarNode.addComponent(this.cmpAvatar);
            basketBallBattleRoyale.avatarNode.addComponent(basketBallBattleRoyale.cmpCamera);
            this.players[0].appendChild(basketBallBattleRoyale.avatarNode);
        }
        handleInputAvatar(_deltaTime) {
            if (fCore.Keyboard.isPressedOne([
                fCore.KEYBOARD_CODE.W,
                fCore.KEYBOARD_CODE.ARROW_UP
            ]))
                this.forwardMovement = this.movementspeed;
            else if (this.forwardMovement >= 0)
                this.forwardMovement -= _deltaTime * this.frictionFactor;
            if (fCore.Keyboard.isPressedOne([
                fCore.KEYBOARD_CODE.S,
                fCore.KEYBOARD_CODE.ARROW_DOWN
            ]))
                this.backwardMovement = -this.movementspeed;
            else if (this.backwardMovement <= 0)
                this.backwardMovement += _deltaTime * this.frictionFactor;
        }
        avatarMovement(_deltaTime) {
            let playerForward;
            playerForward = fCore.Vector3.Z();
            playerForward.transform(basketBallBattleRoyale.avatarNode.mtxWorld, false);
            let movementVelocity = new fCore.Vector3();
            movementVelocity.x =
                playerForward.x * (this.forwardMovement + this.backwardMovement) * this.movementspeed;
            movementVelocity.y = this.cmpAvatar.getVelocity().y;
            movementVelocity.z =
                playerForward.z * (this.forwardMovement + this.backwardMovement) * this.movementspeed;
            this.cmpAvatar.setVelocity(movementVelocity);
        }
        //avatars functionality for grabbing basketballs
        isGrabbingBasket() {
            let throwThreshold = 6;
            let throwMinDistance = 6;
            if (basketBallBattleRoyale.basketBalls != undefined) {
                if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.E])) {
                    if (basketBallBattleRoyale.basketBalls[0].getComponent(basketBallBattleRoyale.BasketBallsController).isInUse)
                        return;
                    let distance = fCore.Vector3.DIFFERENCE(basketBallBattleRoyale.basketBalls[0].mtxWorld.translation, basketBallBattleRoyale.avatarNode.mtxWorld.translation);
                    if (distance.magnitude > throwThreshold)
                        return;
                    basketBallBattleRoyale.basketBalls[0].getComponent(fCore.ComponentRigidbody).setVelocity(fCore.Vector3.ZERO());
                    basketBallBattleRoyale.basketBalls[0].getComponent(fCore.ComponentRigidbody).setRotation(fCore.Vector3.ZERO());
                    this.isGrabbed = true;
                }
                //which target was chosen from raycast-info
                if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.R]) && this.isGrabbed == true) {
                    this.avatarsContainer.getChildren().forEach(player => {
                        if (player.getChild(0).name == this.targetPlayersName)
                            this.collMeshesOfBasketTrigger.forEach(trigger => {
                                if (player.getChild(0).getChild(1) == trigger.getContainer())
                                    this.actualTarget = trigger;
                            });
                        else
                            return;
                    });
                    //check distance to basket
                    if (!this.actualTarget)
                        return;
                    let distance = fCore.Vector3.DIFFERENCE(basketBallBattleRoyale.basketBalls[0].mtxWorld.translation, this.actualTarget.mtxWorld.translation);
                    let distanceMag = distance.magnitude;
                    if (distanceMag < throwMinDistance)
                        return;
                    this.shootCalculation(distanceMag);
                    this.isGrabbed = false;
                    basketBallBattleRoyale.basketBalls[0].getComponent(basketBallBattleRoyale.BasketBallsController).isInUse = false;
                }
            }
        }
        shootCalculation(_distanceMag) {
            let targetOfMesh = this.oldRayHit.rigidbodyComponent.getContainer().getParent();
            targetOfMesh.getComponent(fCore.ComponentMaterial).clrPrimary.a = 0.5;
            targetOfMesh.getChildren().forEach(childMesh => {
                childMesh.getComponent(fCore.ComponentMaterial).clrPrimary.a = 0.5;
            });
            let playerForward;
            playerForward = fCore.Vector3.Z();
            playerForward.transform(basketBallBattleRoyale.avatarNode.mtxWorld, false);
            //diffrent powers for diffrent distances
            console.log(_distanceMag);
            if (_distanceMag > 40)
                basketBallBattleRoyale.basketBalls[0].getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(new fCore.Vector3(playerForward.x * this.throwStrength, _distanceMag * 8.25, playerForward.z * this.throwStrength), basketBallBattleRoyale.avatarNode.mtxWorld.translation);
            else if (_distanceMag > 30 && _distanceMag < 40)
                basketBallBattleRoyale.basketBalls[0].getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(new fCore.Vector3(playerForward.x * this.throwStrength * 0.825, _distanceMag * 10, playerForward.z * this.throwStrength * 0.825), basketBallBattleRoyale.avatarNode.mtxWorld.translation);
            else if (_distanceMag > 20 && _distanceMag < 30)
                basketBallBattleRoyale.basketBalls[0].getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(new fCore.Vector3(playerForward.x * this.throwStrength * 0.70, _distanceMag * 12, playerForward.z * this.throwStrength * 0.70), basketBallBattleRoyale.avatarNode.mtxWorld.translation);
            else if (_distanceMag >= 12 && _distanceMag < 20)
                basketBallBattleRoyale.basketBalls[0].getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(new fCore.Vector3(playerForward.x * this.throwStrength * 0.625, _distanceMag * 18, playerForward.z * this.throwStrength * 0.625), basketBallBattleRoyale.avatarNode.mtxWorld.translation);
            console.log(Math.floor(_distanceMag));
            switch (Math.floor(_distanceMag)) {
                case 11:
                    basketBallBattleRoyale.basketBalls[0].getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(new fCore.Vector3(playerForward.x * this.throwStrength * 0.575, _distanceMag * 20, playerForward.z * this.throwStrength * 0.575), basketBallBattleRoyale.avatarNode.mtxWorld.translation);
                    break;
                case 10:
                    basketBallBattleRoyale.basketBalls[0].getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(new fCore.Vector3(playerForward.x * this.throwStrength * 0.55, _distanceMag * 22, playerForward.z * this.throwStrength * 0.55), basketBallBattleRoyale.avatarNode.mtxWorld.translation);
                    break;
                case 9:
                    basketBallBattleRoyale.basketBalls[0].getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(new fCore.Vector3(playerForward.x * this.throwStrength * 0.50, _distanceMag * 24, playerForward.z * this.throwStrength * 0.50), basketBallBattleRoyale.avatarNode.mtxWorld.translation);
                    break;
                case 8:
                    basketBallBattleRoyale.basketBalls[0].getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(new fCore.Vector3(playerForward.x * this.throwStrength * 0.475, _distanceMag * 27, playerForward.z * this.throwStrength * 0.475), basketBallBattleRoyale.avatarNode.mtxWorld.translation);
                    // tslint:disable-next-line: align
                    break;
                case 7:
                    basketBallBattleRoyale.basketBalls[0].getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(new fCore.Vector3(playerForward.x * this.throwStrength * 0.425, _distanceMag * 32, playerForward.z * this.throwStrength * 0.425), basketBallBattleRoyale.avatarNode.mtxWorld.translation);
                    // tslint:disable-next-line: align
                    break;
                case 6:
                    basketBallBattleRoyale.basketBalls[0].getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(new fCore.Vector3(playerForward.x * this.throwStrength * 0.4, _distanceMag * 39, playerForward.z * this.throwStrength * 0.4), basketBallBattleRoyale.avatarNode.mtxWorld.translation);
                    // tslint:disable-next-line: align
                    break;
            }
        }
        //avatars functionality for grabbing basketballs
        //which target functionality for avatar
        whichTargetToChooseAvatar() {
            let mtxAvatar = this.cmpAvatar.getContainer().mtxWorld;
            let rayHit = ƒ.Physics.raycast(ƒ.Vector3.DIFFERENCE(this.cmpAvatar.getPosition(), ƒ.Vector3.Y(-5.7)), mtxAvatar.getZ(), 80);
            if (rayHit.rigidbodyComponent)
                if (rayHit.rigidbodyComponent.physicsType != fCore.PHYSICS_TYPE.DYNAMIC) {
                    if (rayHit.rigidbodyComponent.getContainer().name != "Brett")
                        return "Wrong Target";
                    let meshContainer = rayHit.rigidbodyComponent.getContainer().getParent();
                    meshContainer.getComponent(fCore.ComponentMaterial).clrPrimary.a = 1.5;
                    meshContainer.getChildren().forEach(childMesh => {
                        childMesh.getComponent(fCore.ComponentMaterial).clrPrimary.a = 1.5;
                    });
                    if (this.oldRayHit)
                        if (this.oldRayHit.rigidbodyComponent != rayHit.rigidbodyComponent) {
                            let oldMesh = this.oldRayHit.rigidbodyComponent.getContainer().getParent();
                            oldMesh.getComponent(fCore.ComponentMaterial).clrPrimary.a = 0.5;
                            oldMesh.getChildren().forEach(childMesh => {
                                childMesh.getComponent(fCore.ComponentMaterial).clrPrimary.a = 0.5;
                            });
                        }
                    this.oldRayHit = rayHit;
                    return rayHit.rigidbodyComponent.getContainer().getParent().getParent().getParent().name;
                }
                else
                    return "No Target in focus";
            else
                return "RayHit ist no Rigidbody";
        }
    }
    basketBallBattleRoyale.AvatarController = AvatarController;
})(basketBallBattleRoyale || (basketBallBattleRoyale = {}));
//# sourceMappingURL=AvatarController.js.map