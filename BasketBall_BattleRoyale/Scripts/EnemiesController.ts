namespace basketBallBattleRoyale {
    import fCore = FudgeCore;


    fCore.Project.registerScriptNamespace(basketBallBattleRoyale);
    export class EnemiesController extends fCore.ComponentScript {

        public score: number;
        public myBsktTrigger: fCore.ComponentMesh;

        private basketBalls: fCore.Node[];
        private containerEnemy: fCore.Node;
        private containerMesh: fCore.Node;
        private enemyContainer: fCore.Node;
        private childAvatarNode: fCore.Node;
        private throwStrength: number = 10;
        private containerTriggers: fCore.ComponentMesh[];
        private rgdBdyEnemy: fCore.ComponentRigidbody;

        private waitTime: number = 2;
        private movementSpeed: number = 1.3;

        private rndChosenTarget: fCore.ComponentMesh;
        private hasGrabbed: boolean;
        constructor(_containerEnemy: fCore.Node, _containerMesh: fCore.Node, _rgdBdyEnemy: fCore.ComponentRigidbody, _score: number, _basketBalls: fCore.Node[], _containerTriggers: fCore.ComponentMesh[]) {
            super();
            this.containerEnemy = _containerEnemy;
            this.containerMesh = _containerMesh;
            this.rgdBdyEnemy = _rgdBdyEnemy;
            this.enemyContainer = _rgdBdyEnemy.getContainer();
            this.score = _score;
            this.basketBalls = _basketBalls;
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
            if (!this.hasGrabbed) return;
            if (this.basketBalls[0].getComponent(BasketBallsController).isInUse) {
                if (!this.basketBalls[0].getComponent(BasketBallsController).isInFlight) {
                    this.basketBalls[0].getComponent(fCore.ComponentRigidbody).setVelocity(fCore.Vector3.ZERO());
                    this.basketBalls[0].getComponent(fCore.ComponentRigidbody).setRotation(fCore.Vector3.ZERO());
                    this.basketBalls[0].getComponent(fCore.ComponentRigidbody).setPosition(this.childAvatarNode.mtxWorld.translation);
                    this.basketBalls[0].mtxWorld.translate(this.childAvatarNode.mtxWorld.translation);
                    this.rgdBdyEnemy.setVelocity(fCore.Vector3.ZERO());

                    this.waitTime = this.waitTime - fCore.Loop.timeFrameReal / 1000;
                    if (this.waitTime <= 0)
                        this.basketBalls[0].getComponent(BasketBallsController).isInFlight = true;

                }
                if (this.basketBalls[0].getComponent(BasketBallsController).isInFlight) {
                    let randomTargetNmb: number = new fCore.Random().getRangeFloored(0, 4);
                    this.rndChosenTarget = this.containerTriggers[randomTargetNmb];
                    if (this.myBsktTrigger == this.rndChosenTarget) return;
                    this.waitTime = 2;

                    let distance: fCore.Vector3 = fCore.Vector3.DIFFERENCE(this.basketBalls[0].mtxWorld.translation, this.rndChosenTarget.mtxWorld.translation);
                    let distanceMag: number = distance.magnitude;

                    let playerForward: fCore.Vector3 = new fCore.Vector3(this.rndChosenTarget.mtxWorld.translation.x - this.enemyContainer.mtxWorld.translation.x, 0, this.rndChosenTarget.mtxWorld.translation.z - this.enemyContainer.mtxWorld.translation.z);

                    playerForward.transform(this.rndChosenTarget.mtxWorld, false);


                    console.log(distanceMag);
                    if (distanceMag > 60)
                        this.basketBalls[0].getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(
                            new fCore.Vector3(playerForward.x * this.throwStrength / 3, distanceMag * 5, playerForward.z * this.throwStrength / 3),
                            this.enemyContainer.mtxWorld.translation);
                    if (distanceMag > 50 && distanceMag < 60)
                        this.basketBalls[0].getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(
                            new fCore.Vector3(playerForward.x * this.throwStrength * 0.9, distanceMag * 7, playerForward.z * this.throwStrength * 0.9),
                            this.enemyContainer.mtxWorld.translation);
                    else if (distanceMag > 40 && distanceMag < 50)
                        this.basketBalls[0].getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(
                            new fCore.Vector3(playerForward.x * this.throwStrength * 0.8, distanceMag * 8, playerForward.z * this.throwStrength * 0.8),
                            this.enemyContainer.mtxWorld.translation);
                    else if (distanceMag > 30 && distanceMag < 40)
                        this.basketBalls[0].getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(
                            new fCore.Vector3(playerForward.x * this.throwStrength * 0.7, distanceMag * 9, playerForward.z * this.throwStrength * 0.7),
                            this.enemyContainer.mtxWorld.translation);
                    else if (distanceMag > 20 && distanceMag < 30)
                        this.basketBalls[0].getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(
                            new fCore.Vector3(playerForward.x * this.throwStrength * 0.6, distanceMag * 10, playerForward.z * this.throwStrength * 0.6),
                            this.enemyContainer.mtxWorld.translation);
                    else if (distanceMag > 10 && distanceMag < 20)
                        this.basketBalls[0].getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(
                            new fCore.Vector3(playerForward.x * this.throwStrength * 0.5, distanceMag * 12, playerForward.z * this.throwStrength * 0.5),
                            this.enemyContainer.mtxWorld.translation);
                    this.basketBalls[0].getComponent(BasketBallsController).isInFlight = false;
                    this.basketBalls[0].getComponent(BasketBallsController).isInUse = false;
                    this.hasGrabbed = false;
                }
            }
        }

        private moveToAvailableBalls = (): void => {

            if (this.basketBalls[0].getComponent(BasketBallsController).isInUse) {
                let distanceHomeMag: number = fCore.Vector3.DIFFERENCE(this.containerMesh.mtxWorld.translation, this.enemyContainer.mtxWorld.translation).magnitude;
                if (distanceHomeMag > 10) {
                    this.rgdBdyEnemy.setRotation(new fCore.Vector3(0, (this.enemyContainer.mtxWorld.translation.x - this.containerMesh.mtxWorld.translation.x) - (this.enemyContainer.mtxWorld.translation.z - this.containerMesh.mtxWorld.translation.z), 0));
                    this.rgdBdyEnemy.addVelocity(new fCore.Vector3((this.containerMesh.mtxWorld.translation.x - this.enemyContainer.mtxWorld.translation.x) / (distanceHomeMag * this.movementSpeed), 0, (this.containerMesh.mtxWorld.translation.z - this.enemyContainer.mtxWorld.translation.z) / (distanceHomeMag * this.movementSpeed)));

                }
                else
                    this.rgdBdyEnemy.setVelocity(fCore.Vector3.ZERO());
                return;
            }

            let distanceBallMag: number = fCore.Vector3.DIFFERENCE(this.basketBalls[0].mtxWorld.translation, this.enemyContainer.mtxWorld.translation).magnitude;
            if (distanceBallMag >= 3) {
                this.rgdBdyEnemy.setRotation(new fCore.Vector3(0, (- this.enemyContainer.mtxWorld.translation.x - this.basketBalls[0].mtxWorld.translation.x) - (this.enemyContainer.mtxWorld.translation.z - this.basketBalls[0].mtxWorld.translation.z), 0));
                this.rgdBdyEnemy.addVelocity(new fCore.Vector3((this.basketBalls[0].mtxWorld.translation.x - this.enemyContainer.mtxWorld.translation.x) / (distanceBallMag * this.movementSpeed), 0, (this.basketBalls[0].mtxWorld.translation.z - this.enemyContainer.mtxWorld.translation.z) / (distanceBallMag * this.movementSpeed)));

            }
            else {
                this.rgdBdyEnemy.setVelocity(fCore.Vector3.ZERO());
                this.hasGrabbed = true;
                this.basketBalls[0].getComponent(BasketBallsController).isInUse = true;
            }
        }
    }
}