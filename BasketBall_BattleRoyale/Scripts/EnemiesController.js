"use strict";
var basketBallBattleRoyale;
(function (basketBallBattleRoyale) {
    var fCore = FudgeCore;
    fCore.Project.registerScriptNamespace(basketBallBattleRoyale);
    class EnemiesController extends fCore.ComponentScript {
        constructor(_containerEnemy, _containerMesh, _rgdBdyEnemy, _score, _containerTriggers) {
            super();
            this.throwStrength = 10;
            this.waitTime = 2;
            this.movementSpeed = 1.4;
            this.hasGrabbed = false;
            this.whoAmI = () => {
                this.containerTriggers.forEach(trigger => {
                    if (trigger.getContainer().getParent().getParent().getChild(1).name != "Avatar")
                        if (this.containerEnemy.name == trigger.getContainer().getParent().getParent().getChild(1).name) {
                            this.myBsktTrigger = trigger;
                        }
                });
            };
            this.update = () => {
                //     if (!this.actualChosenBall)
                this.checkNearestBall();
                if (this.targetedBall == undefined)
                    return;
                this.moveToAvailableBalls();
                if (this.actualChosenBall == undefined)
                    return;
                if (this.actualChosenBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInUse) {
                    if (!this.actualChosenBall.getComponent(fCore.ComponentRigidbody))
                        this.actualChosenBall = undefined;
                    this.actualChosenBall.getComponent(fCore.ComponentRigidbody).setVelocity(fCore.Vector3.ZERO());
                    this.actualChosenBall.getComponent(fCore.ComponentRigidbody).setRotation(fCore.Vector3.ZERO());
                    this.actualChosenBall.getComponent(fCore.ComponentRigidbody).setPosition(this.childAvatarNode.mtxWorld.translation);
                    this.actualChosenBall.mtxWorld.translate(this.childAvatarNode.mtxWorld.translation);
                    this.rgdBdyEnemy.setVelocity(fCore.Vector3.ZERO());
                    this.waitTime = this.waitTime - fCore.Loop.timeFrameReal / 1000;
                    if (this.waitTime <= 0)
                        this.hasGrabbed = true;
                }
                if (this.hasGrabbed) {
                    let randomTargetNmb = new fCore.Random().getRangeFloored(0, 4);
                    this.rndChosenTarget = this.containerTriggers[randomTargetNmb];
                    if (this.myBsktTrigger == this.rndChosenTarget)
                        return;
                    let distance = fCore.Vector3.DIFFERENCE(this.actualChosenBall.mtxWorld.translation, this.rndChosenTarget.mtxWorld.translation);
                    let distanceMag = distance.magnitude;
                    let enemyForward = new fCore.Vector3(this.rndChosenTarget.mtxWorld.translation.x - this.enemyContainer.mtxWorld.translation.x, 0, this.rndChosenTarget.mtxWorld.translation.z - this.enemyContainer.mtxWorld.translation.z);
                    enemyForward.transform(this.rndChosenTarget.mtxWorld, false);
                    if (distanceMag > 60)
                        this.actualChosenBall.getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(new fCore.Vector3(enemyForward.x * this.throwStrength / 3, distanceMag * 5, enemyForward.z * this.throwStrength / 3), this.enemyContainer.mtxWorld.translation);
                    if (distanceMag > 50 && distanceMag < 60)
                        this.actualChosenBall.getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(new fCore.Vector3(enemyForward.x * this.throwStrength * 0.9, distanceMag * 7, enemyForward.z * this.throwStrength * 0.9), this.enemyContainer.mtxWorld.translation);
                    else if (distanceMag > 40 && distanceMag < 50)
                        this.actualChosenBall.getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(new fCore.Vector3(enemyForward.x * this.throwStrength * 0.8, distanceMag * 8, enemyForward.z * this.throwStrength * 0.8), this.enemyContainer.mtxWorld.translation);
                    else if (distanceMag > 30 && distanceMag < 40)
                        this.actualChosenBall.getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(new fCore.Vector3(enemyForward.x * this.throwStrength * 0.7, distanceMag * 9, enemyForward.z * this.throwStrength * 0.7), this.enemyContainer.mtxWorld.translation);
                    else if (distanceMag > 20 && distanceMag < 30)
                        this.actualChosenBall.getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(new fCore.Vector3(enemyForward.x * this.throwStrength * 0.6, distanceMag * 10, enemyForward.z * this.throwStrength * 0.6), this.enemyContainer.mtxWorld.translation);
                    else if (distanceMag > 10 && distanceMag < 20)
                        this.actualChosenBall.getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(new fCore.Vector3(enemyForward.x * this.throwStrength * 0.5, distanceMag * 12, enemyForward.z * this.throwStrength * 0.5), this.enemyContainer.mtxWorld.translation);
                    this.actualChosenBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInUse = false;
                    this.hasGrabbed = false;
                    this.waitTime = 2;
                }
            };
            this.checkNearestBall = () => {
                //checking of avaible balls
                let counterOfBallsInUse = 0;
                basketBallBattleRoyale.basketBalls.forEach(basketBall => {
                    if (basketBall.getComponent(basketBallBattleRoyale.BasketBallsController) != null)
                        if (basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInUse)
                            counterOfBallsInUse++;
                });
                //enemy goes home if all balls are in use
                console.log(counterOfBallsInUse);
                if (counterOfBallsInUse == basketBallBattleRoyale.basketBalls.length - 3) {
                    this.targetedBall = undefined;
                    this.actualChosenBall = undefined;
                    let distanceHomeMag = fCore.Vector3.DIFFERENCE(this.containerMesh.mtxWorld.translation, this.enemyContainer.mtxWorld.translation).magnitude;
                    if (distanceHomeMag > 10) {
                        this.rgdBdyEnemy.setRotation(new fCore.Vector3(0, (this.enemyContainer.mtxWorld.translation.x - this.containerMesh.mtxWorld.translation.x) - (this.enemyContainer.mtxWorld.translation.z - this.containerMesh.mtxWorld.translation.z) * 10, 0));
                        this.rgdBdyEnemy.addVelocity(new fCore.Vector3((this.containerMesh.mtxWorld.translation.x - this.enemyContainer.mtxWorld.translation.x) / (distanceHomeMag * this.movementSpeed), 0, (this.containerMesh.mtxWorld.translation.z - this.enemyContainer.mtxWorld.translation.z) / (distanceHomeMag * this.movementSpeed)));
                    }
                    else
                        this.rgdBdyEnemy.setVelocity(fCore.Vector3.ZERO());
                    return;
                }
                //if balls are avaible get the nearest one and set to the targetBall
                this.nearestDistance = undefined;
                basketBallBattleRoyale.basketBalls.forEach(basketBall => {
                    if (basketBall.getComponent(basketBallBattleRoyale.BasketBallsController) != null) {
                        if (!basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInUse) {
                            if (this.nearestDistance == undefined || this.nearestDistance > fCore.Vector3.DIFFERENCE(basketBall.mtxWorld.translation, this.enemyContainer.mtxWorld.translation).magnitude) {
                                if (fCore.Vector3.DIFFERENCE(basketBall.mtxWorld.translation, this.enemyContainer.mtxWorld.translation).magnitude != 0) {
                                    this.nearestDistance = fCore.Vector3.DIFFERENCE(basketBall.mtxWorld.translation, this.enemyContainer.mtxWorld.translation).magnitude;
                                }
                            }
                        }
                    }
                });
                basketBallBattleRoyale.basketBalls.forEach(basketBall => {
                    if (basketBall.getComponent(basketBallBattleRoyale.BasketBallsController) != null) {
                        if (!basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInUse) {
                            if (this.nearestDistance == fCore.Vector3.DIFFERENCE(basketBall.mtxWorld.translation, this.enemyContainer.mtxWorld.translation).magnitude) {
                                this.targetedBall = basketBall;
                            }
                        }
                    }
                });
            };
            this.moveToAvailableBalls = () => {
                if (this.targetedBall) {
                    this.distanceBallMag = fCore.Vector3.DIFFERENCE(this.targetedBall.mtxWorld.translation, this.enemyContainer.mtxWorld.translation).magnitude;
                    if (this.distanceBallMag >= 1.5) {
                        this.rgdBdyEnemy.setRotation(new fCore.Vector3(0, (-this.enemyContainer.mtxWorld.translation.x - this.targetedBall.mtxWorld.translation.x) - (this.enemyContainer.mtxWorld.translation.z - this.targetedBall.mtxWorld.translation.z) * 10, 0));
                        this.rgdBdyEnemy.addVelocity(new fCore.Vector3((this.targetedBall.mtxWorld.translation.x - this.enemyContainer.mtxWorld.translation.x) / (this.distanceBallMag * this.movementSpeed), 0, (this.targetedBall.mtxWorld.translation.z - this.enemyContainer.mtxWorld.translation.z) / (this.distanceBallMag * this.movementSpeed)));
                    }
                    else {
                        this.actualChosenBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInUse = true;
                        this.actualChosenBall = this.targetedBall;
                        this.rgdBdyEnemy.setVelocity(fCore.Vector3.ZERO());
                    }
                }
            };
            this.containerEnemy = _containerEnemy;
            this.containerMesh = _containerMesh;
            this.rgdBdyEnemy = _rgdBdyEnemy;
            this.enemyContainer = _rgdBdyEnemy.getContainer();
            this.score = _score;
            this.containerTriggers = _containerTriggers;
            this.childAvatarNode = new fCore.Node("childAvatarNode");
            this.childAvatarNode.addComponent(new fCore.ComponentTransform());
            this.childAvatarNode.mtxLocal.translate(new fCore.Vector3(0, 3, 0));
            this.containerEnemy.appendChild(this.childAvatarNode);
            this.whoAmI();
            fCore.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
            fCore.Loop.start(fCore.LOOP_MODE.TIME_REAL, 60);
        }
    }
    basketBallBattleRoyale.EnemiesController = EnemiesController;
})(basketBallBattleRoyale || (basketBallBattleRoyale = {}));
//# sourceMappingURL=EnemiesController.js.map