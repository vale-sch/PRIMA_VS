"use strict";
var basketBallBattleRoyale;
(function (basketBallBattleRoyale) {
    var fCore = FudgeCore;
    fCore.Project.registerScriptNamespace(basketBallBattleRoyale);
    class EnemyController extends fCore.ComponentScript {
        constructor(_containerEnemy, _containerMesh, _rgdBdyEnemy, _score, _basketBalls, _containerTrigger) {
            super();
            this.waitTime = 2;
            this.movementSpeed = 1.25;
            this.throwStrength = 10;
            this.update = () => {
                this.moveToAvailableBalls();
                if (!this.hasGrabbed)
                    return;
                if (this.basketBalls[0].getComponent(basketBallBattleRoyale.BasketBallsController).isInUse) {
                    if (!this.basketBalls[0].getComponent(basketBallBattleRoyale.BasketBallsController).isInFlight) {
                        this.basketBalls[0].getComponent(fCore.ComponentRigidbody).setVelocity(fCore.Vector3.ZERO());
                        this.basketBalls[0].getComponent(fCore.ComponentRigidbody).setRotation(fCore.Vector3.ZERO());
                        this.basketBalls[0].getComponent(fCore.ComponentRigidbody).setPosition(this.childAvatarNode.mtxWorld.translation);
                        this.basketBalls[0].mtxWorld.translate(this.childAvatarNode.mtxWorld.translation);
                        this.rgdBdyEnemy.setVelocity(fCore.Vector3.ZERO());
                        this.waitTime = this.waitTime - fCore.Loop.timeFrameReal / 1000;
                        if (this.waitTime <= 0) {
                            this.basketBalls[0].getComponent(basketBallBattleRoyale.BasketBallsController).isInFlight = true;
                        }
                        //diffrent powers for diffrent distances
                    }
                    if (this.basketBalls[0].getComponent(basketBallBattleRoyale.BasketBallsController).isInFlight) {
                        let randomTarget = new fCore.Random().getRangeFloored(0, 4);
                        this.waitTime = 2;
                        let distance = fCore.Vector3.DIFFERENCE(this.basketBalls[0].mtxWorld.translation, this.containerTriggers[randomTarget].mtxWorld.translation);
                        let distanceMag = distance.magnitude;
                        let playerForward = new fCore.Vector3(this.containerTriggers[randomTarget].mtxWorld.translation.x - this.enemyContainer.mtxWorld.translation.x, 0, this.containerTriggers[randomTarget].mtxWorld.translation.z - this.enemyContainer.mtxWorld.translation.z);
                        playerForward.transform(this.containerTriggers[randomTarget].mtxWorld, false);
                        this.containerTriggers[randomTarget].getContainer().getComponent(fCore.ComponentRigidbody).addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, basketBallBattleRoyale.hndTrigger);
                        console.log(this.containerTriggers[randomTarget].getContainer().getParent().name);
                        this.basketBalls[0].getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(new fCore.Vector3(playerForward.x * 8, distanceMag * 2, playerForward.z * 8), this.enemyContainer.mtxWorld.translation);
                        if (distanceMag > 16.5)
                            this.basketBalls[0].getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(new fCore.Vector3(playerForward.x * this.throwStrength, distanceMag * 3, playerForward.z * this.throwStrength), this.enemyContainer.mtxWorld.translation);
                        else if (distanceMag > 10 && distanceMag < 16.5)
                            this.basketBalls[0].getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(new fCore.Vector3(playerForward.x * this.throwStrength * 0.7, distanceMag * 3, playerForward.z * this.throwStrength * 0.7), this.enemyContainer.mtxWorld.translation);
                        else if (distanceMag < 10)
                            this.basketBalls[0].getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(new fCore.Vector3(playerForward.x * this.throwStrength * 0.525, distanceMag * 3, playerForward.z * this.throwStrength * 0.525), this.enemyContainer.mtxWorld.translation);
                        this.basketBalls[0].getComponent(basketBallBattleRoyale.BasketBallsController).isInFlight = false;
                        this.basketBalls[0].getComponent(basketBallBattleRoyale.BasketBallsController).isInUse = false;
                        this.hasGrabbed = false;
                    }
                }
            };
            this.moveToAvailableBalls = () => {
                if (this.basketBalls[0].getComponent(basketBallBattleRoyale.BasketBallsController).isInUse) {
                    let distanceHomeMag = fCore.Vector3.DIFFERENCE(this.containerMesh.mtxWorld.translation, this.enemyContainer.mtxWorld.translation).magnitude;
                    if (distanceHomeMag > 4)
                        this.rgdBdyEnemy.addVelocity(new fCore.Vector3((this.containerMesh.mtxWorld.translation.x - this.enemyContainer.mtxWorld.translation.x) / (distanceHomeMag * this.movementSpeed), 0, (this.containerMesh.mtxWorld.translation.z - this.enemyContainer.mtxWorld.translation.z) / (distanceHomeMag * this.movementSpeed)));
                    else
                        this.rgdBdyEnemy.setVelocity(fCore.Vector3.ZERO());
                    return;
                }
                let distanceBallMag = fCore.Vector3.DIFFERENCE(this.basketBalls[0].mtxWorld.translation, this.enemyContainer.mtxWorld.translation).magnitude;
                if (distanceBallMag >= 3) {
                    this.rgdBdyEnemy.addVelocity(new fCore.Vector3((this.basketBalls[0].mtxWorld.translation.x - this.enemyContainer.mtxWorld.translation.x) / (distanceBallMag * this.movementSpeed), 0, (this.basketBalls[0].mtxWorld.translation.z - this.enemyContainer.mtxWorld.translation.z) / (distanceBallMag * this.movementSpeed)));
                }
                else {
                    this.rgdBdyEnemy.setVelocity(fCore.Vector3.ZERO());
                    this.hasGrabbed = true;
                    this.basketBalls[0].getComponent(basketBallBattleRoyale.BasketBallsController).isInUse = true;
                }
                this.enemyContainer.mtxLocal.lookAtRotate(this.basketBalls[0].mtxWorld.translation, fCore.Vector3.Y(), true);
            };
            this.containerEnemy = _containerEnemy;
            this.containerMesh = _containerMesh;
            this.rgdBdyEnemy = _rgdBdyEnemy;
            this.enemyContainer = _rgdBdyEnemy.getContainer();
            this.score = _score;
            this.basketBalls = _basketBalls;
            this.containerTriggers = _containerTrigger;
            this.childAvatarNode = new fCore.Node("childAvatarNode");
            this.childAvatarNode.addComponent(new fCore.ComponentTransform());
            this.childAvatarNode.mtxLocal.translate(new fCore.Vector3(0, 3, 0));
            this.containerEnemy.appendChild(this.childAvatarNode);
            fCore.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
            fCore.Loop.start(fCore.LOOP_MODE.TIME_REAL, 60);
        }
    }
    basketBallBattleRoyale.EnemyController = EnemyController;
})(basketBallBattleRoyale || (basketBallBattleRoyale = {}));
//# sourceMappingURL=EnemiesController.js.map