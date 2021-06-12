"use strict";
var basketBallBattleRoyale;
(function (basketBallBattleRoyale) {
    var fCore = FudgeCore;
    fCore.Project.registerScriptNamespace(basketBallBattleRoyale);
    class EnemiesController extends fCore.ComponentScript {
        constructor(_containerEnemy, _containerMesh, _rgdBdyEnemy, _score, _containerTriggers) {
            super();
            this.throwStrength = 10;
            this.waitTime = 1;
            this.movementSpeed = 0.75;
            this.hasGrabbed = false;
            this.isInGrabbingRange = false;
            this.hasShot = false;
            this.whoAmI = () => {
                this.containerTriggers.forEach(trigger => {
                    if (trigger.getContainer().getParent().getParent().getChild(1).name != "Avatar")
                        if (this.containerEnemy.name == trigger.getContainer().getParent().getParent().getChild(1).name) {
                            this.myBsktTrigger = trigger;
                        }
                });
            };
            this.update = () => {
                if (this.hasShot) {
                    this.waitTime = this.waitTime - fCore.Loop.timeFrameReal / 1000;
                    if (this.waitTime <= 0) {
                        this.actualChosenBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInFlight = false;
                        this.actualChosenBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInEnemysTargetAlready = false;
                        this.actualChosenBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInUse = false;
                        this.actualChosenBall = null;
                        this.hasShot = false;
                        this.waitTime = 1;
                    }
                    this.checkNearestBall();
                    return;
                }
                if (this.targetedBall) {
                    if (this.isInGrabbingRange) {
                        this.calculateShootAction();
                        return;
                    }
                    this.moveToAvailableBalls();
                }
                else
                    this.checkNearestBall();
            };
            this.checkNearestBall = () => {
                if (this.targetedBall)
                    return;
                if (!basketBallBattleRoyale.basketBalls)
                    return;
                let howMuchActiveBalls = 0;
                basketBallBattleRoyale.basketBalls.forEach(basketBall => {
                    if (basketBall.getComponent(basketBallBattleRoyale.BasketBallsController))
                        if (!basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInEnemysTargetAlready && !basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInUse)
                            howMuchActiveBalls++;
                });
                if (howMuchActiveBalls == 0)
                    return;
                this.allDistances = undefined;
                this.allDistances = Array(howMuchActiveBalls);
                for (let i = 0; i < basketBallBattleRoyale.basketBalls.length; i++) {
                    if (basketBallBattleRoyale.basketBalls[i].getComponent(basketBallBattleRoyale.BasketBallsController))
                        if (!basketBallBattleRoyale.basketBalls[i].getComponent(basketBallBattleRoyale.BasketBallsController).isInEnemysTargetAlready && !basketBallBattleRoyale.basketBalls[i].getComponent(basketBallBattleRoyale.BasketBallsController).isInUse)
                            this.allDistances[i] = Math.floor(fCore.Vector3.DIFFERENCE(this.enemyContainer.mtxWorld.translation, basketBallBattleRoyale.basketBalls[i].mtxWorld.translation).magnitude);
                }
                let sortedDistances = this.allDistances.sort();
                basketBallBattleRoyale.basketBalls.forEach(basketBall => {
                    if (basketBall.getComponent(basketBallBattleRoyale.BasketBallsController)) {
                        if (sortedDistances[0] == Math.floor(fCore.Vector3.DIFFERENCE(this.enemyContainer.mtxWorld.translation, basketBall.mtxWorld.translation).magnitude)) {
                            if (basketBall.getComponent(basketBallBattleRoyale.BasketBallsController))
                                if (!basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInEnemysTargetAlready || !basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInUse || !basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInFlight) {
                                    basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInEnemysTargetAlready = true;
                                    this.targetedBall = basketBall;
                                }
                                else if (sortedDistances[1] == Math.floor(fCore.Vector3.DIFFERENCE(this.enemyContainer.mtxWorld.translation, basketBall.mtxWorld.translation).magnitude)) {
                                    if (!basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInEnemysTargetAlready || !basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInUse || !basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInFlight) {
                                        basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInEnemysTargetAlready = true;
                                        this.targetedBall = basketBall;
                                    }
                                    else if (sortedDistances[2] == Math.floor(fCore.Vector3.DIFFERENCE(this.enemyContainer.mtxWorld.translation, basketBall.mtxWorld.translation).magnitude))
                                        if (!basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInEnemysTargetAlready || !basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInUse || !basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInFlight) {
                                            basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInEnemysTargetAlready = true;
                                            this.targetedBall = basketBall;
                                        }
                                        else if (sortedDistances[3] == Math.floor(fCore.Vector3.DIFFERENCE(this.enemyContainer.mtxWorld.translation, basketBall.mtxWorld.translation).magnitude))
                                            if (!basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInEnemysTargetAlready || !basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInUse || !basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInFlight) {
                                                basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInEnemysTargetAlready = true;
                                                this.targetedBall = basketBall;
                                            }
                                            else if (sortedDistances[3] == Math.floor(fCore.Vector3.DIFFERENCE(this.enemyContainer.mtxWorld.translation, basketBall.mtxWorld.translation).magnitude))
                                                if (!basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInEnemysTargetAlready || !basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInUse || !basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInFlight) {
                                                    basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInEnemysTargetAlready = true;
                                                    this.targetedBall = basketBall;
                                                }
                                }
                        }
                    }
                });
                if (!this.targetedBall)
                    this.moveHome();
            };
            this.moveHome = () => {
                let distanceToHome = fCore.Vector3.DIFFERENCE(this.enemyContainer.mtxWorld.translation, this.containerMesh.mtxWorld.translation).magnitude;
                if (distanceToHome > 8) {
                    this.rgdBdyEnemy.setRotation(new fCore.Vector3(0, (this.enemyContainer.mtxWorld.translation.x - this.containerMesh.mtxWorld.translation.x) - (this.enemyContainer.mtxWorld.translation.z - this.containerMesh.mtxWorld.translation.z) * 10, 0));
                    this.rgdBdyEnemy.addVelocity(new fCore.Vector3((this.containerMesh.mtxWorld.translation.x - this.enemyContainer.mtxWorld.translation.x) / (distanceToHome * this.movementSpeed), 0, (this.containerMesh.mtxWorld.translation.z - this.enemyContainer.mtxWorld.translation.z) / (distanceToHome * this.movementSpeed)));
                }
                else
                    this.rgdBdyEnemy.setVelocity(fCore.Vector3.ZERO());
            };
            this.moveToAvailableBalls = () => {
                if (!this.targetedBall)
                    this.actualChosenBall = undefined;
                if (this.targetedBall) {
                    this.distanceBallMag = fCore.Vector3.DIFFERENCE(this.targetedBall.mtxWorld.translation, this.enemyContainer.mtxWorld.translation).magnitude;
                    if (this.distanceBallMag > 2) {
                        if (this.distanceBallMag <= 4.5) {
                            this.isInGrabbingRange = true;
                            this.actualChosenBall = this.targetedBall;
                            this.rgdBdyEnemy.addVelocity(fCore.Vector3.ZERO());
                            return;
                        }
                        this.rgdBdyEnemy.setRotation(new fCore.Vector3(0, (this.enemyContainer.mtxWorld.translation.x - this.targetedBall.mtxWorld.translation.x) - (this.enemyContainer.mtxWorld.translation.z - this.targetedBall.mtxWorld.translation.z) * 10, 0));
                        this.rgdBdyEnemy.addVelocity(new fCore.Vector3((this.targetedBall.mtxWorld.translation.x - this.enemyContainer.mtxWorld.translation.x) / (this.distanceBallMag * this.movementSpeed), 0, (this.targetedBall.mtxWorld.translation.z - this.enemyContainer.mtxWorld.translation.z) / (this.distanceBallMag * this.movementSpeed)));
                    }
                }
            };
            this.calculateShootAction = () => {
                if (!this.actualChosenBall || !this.actualChosenBall.getComponent(fCore.ComponentRigidbody)) {
                    this.actualChosenBall = null;
                    this.targetedBall = null;
                    this.isInGrabbingRange = false;
                    this.hasGrabbed = false;
                    this.waitTime = 1;
                    return;
                }
                this.actualChosenBall.getComponent(fCore.ComponentRigidbody).setVelocity(fCore.Vector3.ZERO());
                this.actualChosenBall.getComponent(fCore.ComponentRigidbody).setRotation(fCore.Vector3.ZERO());
                this.actualChosenBall.getComponent(fCore.ComponentRigidbody).setPosition(this.childEnemyNode.mtxWorld.translation);
                this.actualChosenBall.mtxWorld.translate(this.childEnemyNode.mtxWorld.translation);
                let distanceToMiddle = fCore.Vector3.DIFFERENCE(this.enemyContainer.mtxWorld.translation, basketBallBattleRoyale.cylFloor.mtxWorld.translation).magnitude;
                if (distanceToMiddle >= 2.5) {
                    this.rgdBdyEnemy.setVelocity(new fCore.Vector3((basketBallBattleRoyale.cylFloor.mtxWorld.translation.x - this.containerEnemy.mtxWorld.translation.x), 0, (basketBallBattleRoyale.cylFloor.mtxWorld.translation.z - this.containerEnemy.mtxWorld.translation.z)));
                    return;
                }
                else
                    this.rgdBdyEnemy.setVelocity(fCore.Vector3.ZERO());
                this.waitTime -= fCore.Loop.timeFrameReal / 1000;
                if (this.waitTime <= 0) {
                    this.isInGrabbingRange = false;
                    this.hasGrabbed = true;
                }
                if (this.hasGrabbed) {
                    this.actualChosenBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInFlight = true;
                    this.targetedBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInUse = true;
                    let randomTargetNmb = new fCore.Random().getRangeFloored(0, 4);
                    this.rndChosenTarget = this.containerTriggers[randomTargetNmb];
                    if (this.myBsktTrigger == this.rndChosenTarget)
                        return;
                    this.rgdBdyEnemy.rotateBody(new fCore.Vector3(0, (this.rndChosenTarget.mtxWorld.translation.x - this.enemyContainer.mtxWorld.translation.x) - (this.rndChosenTarget.mtxWorld.translation.z - this.enemyContainer.mtxWorld.translation.z), 0));
                    let enemyForward = new fCore.Vector3(this.rndChosenTarget.mtxWorld.translation.x - this.enemyContainer.mtxWorld.translation.x, 0, this.rndChosenTarget.mtxWorld.translation.z - this.enemyContainer.mtxWorld.translation.z);
                    enemyForward.transform(this.rndChosenTarget.mtxWorld, false);
                    this.actualChosenBall.getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(new fCore.Vector3(enemyForward.x * this.throwStrength, 275, enemyForward.z * this.throwStrength), this.enemyContainer.mtxWorld.translation);
                    this.targetedBall = null;
                    this.allDistances = null;
                    this.hasGrabbed = false;
                    this.isInGrabbingRange = false;
                    this.waitTime = 0.75;
                    this.hasShot = true;
                }
            };
            this.containerEnemy = _containerEnemy;
            this.containerMesh = _containerMesh;
            this.rgdBdyEnemy = _rgdBdyEnemy;
            this.enemyContainer = _rgdBdyEnemy.getContainer();
            this.score = _score;
            this.containerTriggers = _containerTriggers;
            this.childEnemyNode = new fCore.Node("childAvatarNode");
            this.childEnemyNode.addComponent(new fCore.ComponentTransform());
            this.childEnemyNode.mtxLocal.translate(new fCore.Vector3(0, 3, 0));
            this.containerEnemy.appendChild(this.childEnemyNode);
            this.whoAmI();
            fCore.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
            fCore.Loop.start(fCore.LOOP_MODE.TIME_REAL, 60);
        }
    }
    basketBallBattleRoyale.EnemiesController = EnemiesController;
})(basketBallBattleRoyale || (basketBallBattleRoyale = {}));
//# sourceMappingURL=EnemiesController.js.map