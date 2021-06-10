namespace basketBallBattleRoyale {
    import fCore = FudgeCore;


    fCore.Project.registerScriptNamespace(basketBallBattleRoyale);
    export class EnemiesController extends fCore.ComponentScript {

        public score: number;
        public myBsktTrigger: fCore.ComponentMesh;

        private containerEnemy: fCore.Node;
        private containerMesh: fCore.Node;
        private enemyContainer: fCore.Node;
        private childAvatarNode: fCore.Node;
        private throwStrength: number = 10;
        private containerTriggers: fCore.ComponentMesh[];
        private rgdBdyEnemy: fCore.ComponentRigidbody;
        private nearestDistance: number;
        private actualChosenBall: fCore.Node;

        private waitTime: number = 2;
        private movementSpeed: number = 1.3;

        private rndChosenTarget: fCore.ComponentMesh;
        private hasGrabbed: boolean = false;
        constructor(_containerEnemy: fCore.Node, _containerMesh: fCore.Node, _rgdBdyEnemy: fCore.ComponentRigidbody, _score: number, _containerTriggers: fCore.ComponentMesh[]) {
            super();
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
            fCore.Loop.addEventListener(fCore.EVENT.LOOP_FRAME, this.update);
            fCore.Loop.start(fCore.LOOP_MODE.TIME_REAL, 60);
        }
        private whoAmI = (): void => {
            this.containerTriggers.forEach(trigger => {
                if (trigger.getContainer().getParent().getParent().getChild(1).name != "Avatar")
                    if (this.containerEnemy.name == trigger.getContainer().getParent().getParent().getChild(1).name) {
                        this.myBsktTrigger = trigger;
                    }
            });

        }

        private update = (): void => {
            this.moveToAvailableBalls();
            if (!this.actualChosenBall) return;
            console.log(this.actualChosenBall.getComponent(BasketBallsController).isInUse);
            if (this.actualChosenBall.getComponent(BasketBallsController).isInUse) {
                if (!this.actualChosenBall.getComponent(BasketBallsController).isInFlight) {
                    this.actualChosenBall.getComponent(fCore.ComponentRigidbody).setVelocity(fCore.Vector3.ZERO());
                    this.actualChosenBall.getComponent(fCore.ComponentRigidbody).setRotation(fCore.Vector3.ZERO());
                    this.actualChosenBall.getComponent(fCore.ComponentRigidbody).setPosition(this.childAvatarNode.mtxWorld.translation);
                    this.actualChosenBall.mtxWorld.translate(this.childAvatarNode.mtxWorld.translation);
                    this.rgdBdyEnemy.setVelocity(fCore.Vector3.ZERO());

                    this.waitTime = this.waitTime - fCore.Loop.timeFrameReal / 1000;
                    if (this.waitTime <= 0) {
                        this.hasGrabbed = true;
                        this.actualChosenBall.getComponent(BasketBallsController).isInFlight = true;
                    }
                }
                if (this.hasGrabbed) {
                    let randomTargetNmb: number = new fCore.Random().getRangeFloored(0, 4);
                    this.rndChosenTarget = this.containerTriggers[randomTargetNmb];
                    if (this.myBsktTrigger == this.rndChosenTarget) return;
                    if (!this.actualChosenBall) return;
                    this.waitTime = 2;

                    let distance: fCore.Vector3 = fCore.Vector3.DIFFERENCE(this.actualChosenBall.mtxWorld.translation, this.rndChosenTarget.mtxWorld.translation);
                    let distanceMag: number = distance.magnitude;

                    let playerForward: fCore.Vector3 = new fCore.Vector3(this.rndChosenTarget.mtxWorld.translation.x - this.enemyContainer.mtxWorld.translation.x, 0, this.rndChosenTarget.mtxWorld.translation.z - this.enemyContainer.mtxWorld.translation.z);

                    playerForward.transform(this.rndChosenTarget.mtxWorld, false);


                    console.log(distanceMag);
                    if (distanceMag > 60)
                        this.actualChosenBall.getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(
                            new fCore.Vector3(playerForward.x * this.throwStrength / 3, distanceMag * 5, playerForward.z * this.throwStrength / 3),
                            this.enemyContainer.mtxWorld.translation);
                    if (distanceMag > 50 && distanceMag < 60)
                        this.actualChosenBall.getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(
                            new fCore.Vector3(playerForward.x * this.throwStrength * 0.9, distanceMag * 7, playerForward.z * this.throwStrength * 0.9),
                            this.enemyContainer.mtxWorld.translation);
                    else if (distanceMag > 40 && distanceMag < 50)
                        this.actualChosenBall.getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(
                            new fCore.Vector3(playerForward.x * this.throwStrength * 0.8, distanceMag * 8, playerForward.z * this.throwStrength * 0.8),
                            this.enemyContainer.mtxWorld.translation);
                    else if (distanceMag > 30 && distanceMag < 40)
                        this.actualChosenBall.getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(
                            new fCore.Vector3(playerForward.x * this.throwStrength * 0.7, distanceMag * 9, playerForward.z * this.throwStrength * 0.7),
                            this.enemyContainer.mtxWorld.translation);
                    else if (distanceMag > 20 && distanceMag < 30)
                        this.actualChosenBall.getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(
                            new fCore.Vector3(playerForward.x * this.throwStrength * 0.6, distanceMag * 10, playerForward.z * this.throwStrength * 0.6),
                            this.enemyContainer.mtxWorld.translation);
                    else if (distanceMag > 10 && distanceMag < 20)
                        this.actualChosenBall.getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(
                            new fCore.Vector3(playerForward.x * this.throwStrength * 0.5, distanceMag * 12, playerForward.z * this.throwStrength * 0.5),
                            this.enemyContainer.mtxWorld.translation);
                    this.hasGrabbed = false;
                    this.actualChosenBall.getComponent(BasketBallsController).isInUse = false;
                    this.actualChosenBall.getComponent(BasketBallsController).isInFlight = false;

                }
            }
        }

        private moveToAvailableBalls = (): void => {
            let isEveryBallinUse: boolean = false;
            basketBalls.forEach(basketBall => {
                if (basketBall.getComponent(BasketBallsController) == null) {
                    if (isEveryBallinUse) {
                        let distanceHomeMag: number = fCore.Vector3.DIFFERENCE(this.containerMesh.mtxWorld.translation, this.enemyContainer.mtxWorld.translation).magnitude;
                        if (distanceHomeMag > 10) {
                            this.rgdBdyEnemy.setRotation(new fCore.Vector3(0, (this.enemyContainer.mtxWorld.translation.x - this.containerMesh.mtxWorld.translation.x) - (this.enemyContainer.mtxWorld.translation.z - this.containerMesh.mtxWorld.translation.z), 0));
                            this.rgdBdyEnemy.addVelocity(new fCore.Vector3((this.containerMesh.mtxWorld.translation.x - this.enemyContainer.mtxWorld.translation.x) / (distanceHomeMag * this.movementSpeed), 0, (this.containerMesh.mtxWorld.translation.z - this.enemyContainer.mtxWorld.translation.z) / (distanceHomeMag * this.movementSpeed)));

                        }
                        else
                            this.rgdBdyEnemy.setVelocity(fCore.Vector3.ZERO());
                        return;
                    }
                    return;
                }
                if (!basketBall.getComponent(BasketBallsController).isInUse)
                    if (this.nearestDistance == undefined || this.nearestDistance > fCore.Vector3.DIFFERENCE(basketBall.mtxWorld.translation, this.enemyContainer.mtxWorld.translation).magnitude) {
                        this.nearestDistance = fCore.Vector3.DIFFERENCE(basketBall.mtxWorld.translation, this.enemyContainer.mtxWorld.translation).magnitude;
                        this.actualChosenBall = basketBall;
                    }
            });
            if (this.actualChosenBall) {
                let distanceBallMag: number = fCore.Vector3.DIFFERENCE(this.actualChosenBall.mtxWorld.translation, this.enemyContainer.mtxWorld.translation).magnitude;
                if (distanceBallMag >= 2) {
                    this.rgdBdyEnemy.setRotation(new fCore.Vector3(0, (- this.enemyContainer.mtxWorld.translation.x - this.actualChosenBall.mtxWorld.translation.x) - (this.enemyContainer.mtxWorld.translation.z - this.actualChosenBall.mtxWorld.translation.z), 0));
                    this.rgdBdyEnemy.addVelocity(new fCore.Vector3((this.actualChosenBall.mtxWorld.translation.x - this.enemyContainer.mtxWorld.translation.x) / (distanceBallMag * this.movementSpeed), 0, (this.actualChosenBall.mtxWorld.translation.z - this.enemyContainer.mtxWorld.translation.z) / (distanceBallMag * this.movementSpeed)));

                }
                else {
                    this.rgdBdyEnemy.setVelocity(fCore.Vector3.ZERO());
                    this.actualChosenBall.getComponent(BasketBallsController).isInUse = true;
                }
            }
        }
    }
}