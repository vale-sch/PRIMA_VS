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
            this.removingTime = 4;
            this.movementSpeed = 0.95;
            this.hasGrabbed = false;
            this.isNearest = false;
            this.whoAmI = () => {
                this.containerTriggers.forEach(trigger => {
                    if (trigger.getContainer().getParent().getParent().getChild(1).name != "Avatar")
                        if (this.containerEnemy.name == trigger.getContainer().getParent().getParent().getChild(1).name) {
                            this.myBsktTrigger = trigger;
                        }
                });
            };
            this.update = () => {
                if (this.isRemoving) {
                    this.removingTime -= fCore.Loop.timeFrameReal / 1000;
                    if (this.removingTime <= 0) {
                        basketBallBattleRoyale.basketBalls.splice(basketBallBattleRoyale.basketBalls.indexOf(this.copyOfOldBall, 1));
                        this.copyOfOldBall.removeComponent(this.copyOfOldBall.getComponent(fCore.ComponentRigidbody));
                        basketBallBattleRoyale.basketBallContainer.getChild(1).removeChild(this.copyOfOldBall.getParent());
                        this.removingTime = 4;
                        this.isRemoving = false;
                    }
                }
                if (this.hasShot) {
                    this.waitTime = this.waitTime - fCore.Loop.timeFrameReal / 1000;
                    if (this.waitTime <= 0) {
                        this.copyOfOldBall = this.actualChosenBall;
                        this.actualChosenBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInUse = false;
                        this.actualChosenBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInEnemysTargetAlready = false;
                        this.targetedBall = undefined;
                        this.actualChosenBall = undefined;
                        this.hasShot = false;
                        this.waitTime = 2;
                    }
                    return;
                }
                this.checkNearestBall();
                if (this.targetedBall)
                    this.moveToAvailableBalls();
                if (this.isNearest)
                    this.calculateShootAction();
            };
            this.checkNearestBall = () => {
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
                let allDistances = Array(howMuchActiveBalls);
                for (let i = 0; i < basketBallBattleRoyale.basketBalls.length; i++) {
                    if (basketBallBattleRoyale.basketBalls[i].getComponent(basketBallBattleRoyale.BasketBallsController))
                        if (!basketBallBattleRoyale.basketBalls[i].getComponent(basketBallBattleRoyale.BasketBallsController).isInEnemysTargetAlready && !basketBallBattleRoyale.basketBalls[i].getComponent(basketBallBattleRoyale.BasketBallsController).isInUse)
                            allDistances[i] = Math.floor(fCore.Vector3.DIFFERENCE(this.enemyContainer.mtxWorld.translation, basketBallBattleRoyale.basketBalls[i].mtxWorld.translation).magnitude);
                }
                this.nearestDistance = Math.min(...allDistances);
                let sortedDistances = allDistances.sort();
                basketBallBattleRoyale.basketBalls.forEach(basketBall => {
                    if (basketBall.getComponent(basketBallBattleRoyale.BasketBallsController)) {
                        if (this.nearestDistance == Math.floor(fCore.Vector3.DIFFERENCE(this.enemyContainer.mtxWorld.translation, basketBall.mtxWorld.translation).magnitude)) {
                            if (basketBall.getComponent(basketBallBattleRoyale.BasketBallsController))
                                if (!basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInEnemysTargetAlready) {
                                    this.targetedBall = basketBall;
                                    return;
                                }
                        }
                        else if (sortedDistances[1] == Math.floor(fCore.Vector3.DIFFERENCE(this.enemyContainer.mtxWorld.translation, basketBall.mtxWorld.translation).magnitude)) {
                            if (basketBall.getComponent(basketBallBattleRoyale.BasketBallsController))
                                if (!basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInEnemysTargetAlready) {
                                    this.targetedBall = basketBall;
                                    return;
                                }
                        }
                    }
                });
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
                    return;
                if (this.targetedBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInEnemysTargetAlready && !this.isNearest) {
                    this.moveHome();
                    return;
                }
                if (this.targetedBall) {
                    this.distanceBallMag = fCore.Vector3.DIFFERENCE(this.targetedBall.mtxWorld.translation, this.enemyContainer.mtxWorld.translation).magnitude;
                    if (this.distanceBallMag > 2) {
                        if (this.distanceBallMag <= 4) {
                            this.targetedBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInEnemysTargetAlready = true;
                            this.isNearest = true;
                            this.actualChosenBall = this.targetedBall;
                        }
                        this.rgdBdyEnemy.setRotation(new fCore.Vector3(0, (this.enemyContainer.mtxWorld.translation.x - this.targetedBall.mtxWorld.translation.x) - (this.enemyContainer.mtxWorld.translation.z - this.targetedBall.mtxWorld.translation.z) * 10, 0));
                        this.rgdBdyEnemy.addVelocity(new fCore.Vector3((this.targetedBall.mtxWorld.translation.x - this.enemyContainer.mtxWorld.translation.x) / (this.distanceBallMag * this.movementSpeed), 0, (this.targetedBall.mtxWorld.translation.z - this.enemyContainer.mtxWorld.translation.z) / (this.distanceBallMag * this.movementSpeed)));
                    }
                }
            };
            this.calculateShootAction = () => {
                if (!this.actualChosenBall || !this.actualChosenBall.getComponent(fCore.ComponentRigidbody)) {
                    this.actualChosenBall = undefined;
                    return;
                }
                this.actualChosenBall.getComponent(fCore.ComponentRigidbody).setVelocity(fCore.Vector3.ZERO());
                this.actualChosenBall.getComponent(fCore.ComponentRigidbody).setRotation(fCore.Vector3.ZERO());
                this.actualChosenBall.getComponent(fCore.ComponentRigidbody).setPosition(this.childEnemyNode.mtxWorld.translation);
                this.actualChosenBall.mtxWorld.translate(this.childEnemyNode.mtxWorld.translation);
                let distanceToMiddle = fCore.Vector3.DIFFERENCE(this.enemyContainer.mtxWorld.translation, basketBallBattleRoyale.cylFloor.mtxWorld.translation).magnitude;
                if (distanceToMiddle > 8)
                    this.rgdBdyEnemy.setVelocity(new fCore.Vector3((basketBallBattleRoyale.cylFloor.mtxWorld.translation.x - this.containerEnemy.mtxWorld.translation.x), 0, (basketBallBattleRoyale.cylFloor.mtxWorld.translation.z - this.containerEnemy.mtxWorld.translation.z)));
                else
                    this.rgdBdyEnemy.setVelocity(fCore.Vector3.ZERO());
                this.waitTime -= fCore.Loop.timeFrameReal / 1000;
                if (this.waitTime <= 0) {
                    this.actualChosenBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInUse = true;
                    this.hasGrabbed = true;
                    this.isNearest = false;
                }
                if (this.hasGrabbed) {
                    let randomTargetNmb = new fCore.Random().getRangeFloored(0, 4);
                    this.rndChosenTarget = this.containerTriggers[randomTargetNmb];
                    if (this.myBsktTrigger == this.rndChosenTarget)
                        return;
                    this.rgdBdyEnemy.rotateBody(new fCore.Vector3(0, (this.rndChosenTarget.mtxWorld.translation.x - this.enemyContainer.mtxWorld.translation.x) - (this.rndChosenTarget.mtxWorld.translation.z - this.enemyContainer.mtxWorld.translation.z), 0));
                    let distance = fCore.Vector3.DIFFERENCE(this.actualChosenBall.mtxWorld.translation, this.rndChosenTarget.mtxWorld.translation);
                    let distanceMag = distance.magnitude;
                    let enemyForward = new fCore.Vector3(this.rndChosenTarget.mtxWorld.translation.x - this.enemyContainer.mtxWorld.translation.x, 0, this.rndChosenTarget.mtxWorld.translation.z - this.enemyContainer.mtxWorld.translation.z);
                    enemyForward.transform(this.rndChosenTarget.mtxWorld, false);
                    console.log(distanceMag);
                    if (distanceMag > 60)
                        this.actualChosenBall.getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(new fCore.Vector3(enemyForward.x * this.throwStrength, distanceMag * 5, enemyForward.z * this.throwStrength), this.enemyContainer.mtxWorld.translation);
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
                    this.isNearest = false;
                    this.hasGrabbed = false;
                    this.hasShot = true;
                    this.isRemoving = true;
                    this.waitTime = 2;
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