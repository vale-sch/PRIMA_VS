namespace basketBallBattleRoyale {
    import fCore = FudgeCore;

    //Event Systems------------------------------------------------------------
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("pointerlockchange", pointerLockChange);
    window.addEventListener("mousemove", onMouseMove);

    let isPointerInGame: boolean;
    function onPointerDown(_event: MouseEvent): void {
        if (!isPointerInGame)
            canvas.requestPointerLock();
    }

    function pointerLockChange(_event: Event): void {
        if (!document.pointerLockElement)
            isPointerInGame = false;
        else
            isPointerInGame = true;
    }

    function onMouseMove(_event: MouseEvent): void {
        if (isPointerInGame) {
            //roatation for y axis on rgdbdy and mesh
            let rotFriction: number = 10;
            avatarNode.mtxLocal.rotateY(-_event.movementX / rotFriction);
            avatarNode.getComponent(fCore.ComponentRigidbody).rotateBody(fCore.Vector3.Y(-_event.movementX / rotFriction));
            //rotation for x axis on cmpCamera
            let topRotLock: number = -25;
            let botRotLock: number = 30;
            let rotateBackPower: number = 0.15;
            if (cmpCamera.mtxPivot.rotation.x >= topRotLock && cmpCamera.mtxPivot.rotation.x <= botRotLock)
                cmpCamera.mtxPivot.rotateX(_event.movementY / rotFriction);
            else if (cmpCamera.mtxPivot.rotation.x <= topRotLock)
                cmpCamera.mtxPivot.rotateX(rotateBackPower);
            else if (cmpCamera.mtxPivot.rotation.x >= topRotLock)
                cmpCamera.mtxPivot.rotateX(-rotateBackPower);
        }
    }

    //Event Systems------------------------------------------------------------
    fCore.Project.registerScriptNamespace(basketBallBattleRoyale);

    export class AvatarController {
        public score: number = 10;
        private forwardMovement: number = 0;
        private backwardMovement: number = 0;
        private movementspeed: number = 4;
        private frictionFactor: number = 6;
        private throwStrength: number = 500;

        private actualTarget: fCore.ComponentMesh;
        private cmpAvatar: fCore.ComponentRigidbody;

        private childAvatarNode: fCore.Node;
        private avatarsContainer: fCore.Node;
        private players: fCore.Node[];
        private collMeshesOfBasketTrigger: fCore.ComponentMesh[];

        private oldRayHit: ƒ.RayHitInfo;

        private targetPlayersName: string;

        private isGrabbed: boolean;

        constructor(_avatarsContainer: fCore.Node, _collMeshesOfBasketTrigger: fCore.ComponentMesh[], _players: fCore.Node[]) {
            this.avatarsContainer = _avatarsContainer;
            this.collMeshesOfBasketTrigger = _collMeshesOfBasketTrigger;
            this.players = _players;

        }

        public start(): void {
            this.createAvatar();
            console.log("Avatar is initialized!");
            fCore.Loop.addEventListener(fCore.EVENT.LOOP_FRAME, this.update);
            fCore.Loop.start(fCore.LOOP_MODE.TIME_REAL, 60);
        }

        private createAvatar(): void {
            this.cmpAvatar = new fCore.ComponentRigidbody(
                75,
                fCore.PHYSICS_TYPE.DYNAMIC,
                fCore.COLLIDER_TYPE.CAPSULE,
                fCore.PHYSICS_GROUP.DEFAULT
            );
            this.cmpAvatar.restitution = 0.1;
            this.cmpAvatar.rotationInfluenceFactor = fCore.Vector3.ZERO();
            this.cmpAvatar.friction = 100;


            avatarNode = new fCore.Node("AvatarNode");
            avatarNode.addComponent(
                new fCore.ComponentTransform(
                    fCore.Matrix4x4.TRANSLATION(fCore.Vector3.Y(0))
                )
            );

            this.childAvatarNode = new fCore.Node("childAvatarNode");
            this.childAvatarNode.addComponent(new fCore.ComponentTransform());
            this.childAvatarNode.mtxLocal.translate(new fCore.Vector3(0, 1, 4.75));

            avatarNode.appendChild(this.childAvatarNode);
            avatarNode.addComponent(this.cmpAvatar);
            avatarNode.addComponent(cmpCamera);

            this.players[0].appendChild(avatarNode);
        }

        private update = (): void => {
            this.avatarMovement(fCore.Loop.timeFrameReal / 1000);
            this.handleInputAvatar(fCore.Loop.timeFrameReal / 1000);

            //player Grab function
            this.isGrabbingBasket();
            //sub functionality of isGrabbingObjects();
            if (this.isGrabbed) {
                this.targetPlayersName = this.whichTargetToChooseAvatar();
                basketBalls[0].getComponent(BasketBallsController).isInUse = true;
                basketBalls[0].getComponent(fCore.ComponentRigidbody).setVelocity(fCore.Vector3.ZERO());
                basketBalls[0].getComponent(fCore.ComponentRigidbody).setRotation(fCore.Vector3.ZERO());
                basketBalls[0].getComponent(fCore.ComponentRigidbody).setPosition(this.childAvatarNode.mtxWorld.translation);
                basketBalls[0].mtxWorld.translate(this.childAvatarNode.mtxWorld.translation);
            }
        }

        private handleInputAvatar(_deltaTime: number): void {
            if (
                fCore.Keyboard.isPressedOne([
                    fCore.KEYBOARD_CODE.W,
                    fCore.KEYBOARD_CODE.ARROW_UP
                ])
            )
                this.forwardMovement = this.movementspeed;
            else if (this.forwardMovement >= 0) this.forwardMovement -= _deltaTime * this.frictionFactor;

            if (
                fCore.Keyboard.isPressedOne([
                    fCore.KEYBOARD_CODE.S,
                    fCore.KEYBOARD_CODE.ARROW_DOWN
                ])
            )
                this.backwardMovement = - this.movementspeed;
            else if (this.backwardMovement <= 0) this.backwardMovement += _deltaTime * this.frictionFactor;
        }



        private avatarMovement(_deltaTime: number): void {
            let playerForward: fCore.Vector3;
            playerForward = fCore.Vector3.Z();
            playerForward.transform(avatarNode.mtxWorld, false);

            let movementVelocity: fCore.Vector3 = new fCore.Vector3();
            movementVelocity.x =
                playerForward.x * (this.forwardMovement + this.backwardMovement) * this.movementspeed;
            movementVelocity.y = this.cmpAvatar.getVelocity().y;
            movementVelocity.z =
                playerForward.z * (this.forwardMovement + this.backwardMovement) * this.movementspeed;
            this.cmpAvatar.setVelocity(movementVelocity);
        }

        //avatars functionality for grabbing basketballs
        private isGrabbingBasket(): void {
            let throwThreshold: number = 6;
            if (basketBalls != undefined) {
                if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.E])) {
                    if (basketBalls[0].getComponent(BasketBallsController).isInUse) return;
                    let distance: fCore.Vector3 = fCore.Vector3.DIFFERENCE(basketBalls[0].mtxWorld.translation, avatarNode.mtxWorld.translation);
                    if (distance.magnitude > throwThreshold)
                        return;
                    basketBalls[0].getComponent(fCore.ComponentRigidbody).setVelocity(fCore.Vector3.ZERO());
                    basketBalls[0].getComponent(fCore.ComponentRigidbody).setRotation(fCore.Vector3.ZERO());
                    this.isGrabbed = true;

                }
                //which target was chosen from raycast-info
                if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.R]) && this.isGrabbed == true) {
                    this.avatarsContainer.getChildren().forEach(player => {
                        if (player.getChild(0).name == this.targetPlayersName)
                            this.collMeshesOfBasketTrigger.forEach(trigger => {
                                if (player.getChild(0).getChild(1) == trigger.getContainer())
                                    this.actualTarget = trigger;
                            }); else return;

                    });

                    //check distance to basket
                    if (!this.actualTarget) return;
                    let distance: fCore.Vector3 = fCore.Vector3.DIFFERENCE(basketBalls[0].mtxWorld.translation, this.actualTarget.mtxWorld.translation);
                    let distanceMag: number = distance.magnitude;
                    if (distanceMag < throwThreshold) return;

                    let targetOfMesh: fCore.Node = this.oldRayHit.rigidbodyComponent.getContainer().getChild(0);
                    targetOfMesh.getComponent(fCore.ComponentMaterial).clrPrimary.a = 0.5;
                    targetOfMesh.getChildren().forEach(childMesh => {
                        childMesh.getComponent(fCore.ComponentMaterial).clrPrimary.a = 0.5;
                    });

                    let playerForward: fCore.Vector3;
                    playerForward = fCore.Vector3.Z();
                    playerForward.transform(avatarNode.mtxWorld, false);


                    //diffrent powers for diffrent distances
                    console.log(distanceMag);
                    if (distanceMag > 40)
                        basketBalls[0].getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(
                            new fCore.Vector3(playerForward.x * this.throwStrength, distanceMag * 8, playerForward.z * this.throwStrength),
                            avatarNode.mtxWorld.translation);
                    else if (distanceMag > 16.5 && distanceMag < 40)
                        basketBalls[0].getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(
                            new fCore.Vector3(playerForward.x * this.throwStrength * 0.7, distanceMag * 15, playerForward.z * this.throwStrength * 0.7),
                            avatarNode.mtxWorld.translation);
                    else if (distanceMag > 10 && distanceMag < 16.5)
                        basketBalls[0].getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(
                            new fCore.Vector3(playerForward.x * this.throwStrength * 0.7, distanceMag * 15, playerForward.z * this.throwStrength * 0.7),
                            avatarNode.mtxWorld.translation);
                    else if (distanceMag < 10)
                        basketBalls[0].getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(
                            new fCore.Vector3(playerForward.x * this.throwStrength * 0.525, distanceMag * 23, playerForward.z * this.throwStrength * 0.525),
                            avatarNode.mtxWorld.translation);
                    this.isGrabbed = false;
                    basketBalls[0].getComponent(BasketBallsController).isInUse = false;
                }
            }
        }
        //avatars functionality for grabbing basketballs

        //which target functionality for avatar
        private whichTargetToChooseAvatar(): string {
            let mtxAvatar: ƒ.Matrix4x4 = this.cmpAvatar.getContainer().mtxWorld;
            let rayHit: ƒ.RayHitInfo = ƒ.Physics.raycast(ƒ.Vector3.DIFFERENCE(this.cmpAvatar.getPosition(), ƒ.Vector3.Y(1)), mtxAvatar.getZ(), 80);
            if (rayHit.rigidbodyComponent)
                if (rayHit.rigidbodyComponent.physicsType != fCore.PHYSICS_TYPE.DYNAMIC) {
                    if (rayHit.rigidbodyComponent.getContainer().name != "Mesh") return "Wrong Target";
                    let mesh: fCore.Node = rayHit.rigidbodyComponent.getContainer().getChild(0);
                    mesh.getComponent(fCore.ComponentMaterial).clrPrimary.a = 1.5;
                    mesh.getChildren().forEach(childMesh => {
                        childMesh.getComponent(fCore.ComponentMaterial).clrPrimary.a = 1.5;
                    });
                    if (this.oldRayHit)
                        if (this.oldRayHit.rigidbodyComponent != rayHit.rigidbodyComponent) {
                            let oldMesh: fCore.Node = this.oldRayHit.rigidbodyComponent.getContainer().getChild(0);
                            oldMesh.getComponent(fCore.ComponentMaterial).clrPrimary.a = 0.5;
                            oldMesh.getChildren().forEach(childMesh => {
                                childMesh.getComponent(fCore.ComponentMaterial).clrPrimary.a = 0.5;
                            });
                        }
                    this.oldRayHit = rayHit;
                    return rayHit.rigidbodyComponent.getContainer().getParent().name;
                }
                else return "No Target in focus";
            else
                return "RayHit ist no Rigidbody";

        }
        //which target functionality for avatar
    }
}