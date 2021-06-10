"use strict";
var basketBallBattleRoyale;
(function (basketBallBattleRoyale) {
    var fCore = FudgeCore;
    window.addEventListener("load", start);
    let hitsCounteAvatar = 10;
    let hitsCounteEnemyBlue = 10;
    let hitsCounteEnemyRed = 10;
    let hitsCounteEnemyMagenta = 10;
    let parentToRemove;
    let isRemoving = false;
    let removingTime = 1.5;
    let rgdBdyToRemove;
    function hndTriggerAvatar(_event) {
        if (_event.cmpRigidbody.getContainer().name == "BasketBallPrefab") {
            _event.cmpRigidbody.getContainer().getComponent(basketBallBattleRoyale.BasketBallsController).isInUse = false;
            _event.cmpRigidbody.getContainer().getComponent(basketBallBattleRoyale.BasketBallsController).isInFlight = false;
            // tslint:disable-next-line: no-use-before-declare
            basketBallBattleRoyale.basketBalls.forEach(basketBall => {
                if (basketBall.getParent() == _event.cmpRigidbody.getContainer().getParent()) {
                    parentToRemove = _event.cmpRigidbody.getContainer().getParent();
                }
            });
            rgdBdyToRemove = _event.cmpRigidbody;
            basketBallBattleRoyale.gameState.hitsAvatar = "Avatar Leben: " + --hitsCounteAvatar;
            isRemoving = true;
        }
    }
    basketBallBattleRoyale.hndTriggerAvatar = hndTriggerAvatar;
    function hndTriggerEnemyBlue(_event) {
        if (_event.cmpRigidbody.getContainer().name == "BasketBallPrefab") {
            _event.cmpRigidbody.getContainer().getComponent(basketBallBattleRoyale.BasketBallsController).isInUse = false;
            _event.cmpRigidbody.getContainer().getComponent(basketBallBattleRoyale.BasketBallsController).isInFlight = false;
            // tslint:disable-next-line: no-use-before-declare
            basketBallBattleRoyale.basketBalls.forEach(basketBall => {
                if (basketBall.getParent() == _event.cmpRigidbody.getContainer().getParent()) {
                    parentToRemove = _event.cmpRigidbody.getContainer().getParent();
                }
            });
            rgdBdyToRemove = _event.cmpRigidbody;
            basketBallBattleRoyale.gameState.hitsEnemyBlue = "EnemyBlue Leben: " + --hitsCounteEnemyBlue;
            isRemoving = true;
        }
    }
    basketBallBattleRoyale.hndTriggerEnemyBlue = hndTriggerEnemyBlue;
    function hndTriggerEnemyRed(_event) {
        if (_event.cmpRigidbody.getContainer().name == "BasketBallPrefab") {
            _event.cmpRigidbody.getContainer().getComponent(basketBallBattleRoyale.BasketBallsController).isInUse = false;
            _event.cmpRigidbody.getContainer().getComponent(basketBallBattleRoyale.BasketBallsController).isInFlight = false;
            // tslint:disable-next-line: no-use-before-declare
            basketBallBattleRoyale.basketBalls.forEach(basketBall => {
                if (basketBall.getParent() == _event.cmpRigidbody.getContainer().getParent()) {
                    parentToRemove = _event.cmpRigidbody.getContainer().getParent();
                }
            });
            rgdBdyToRemove = _event.cmpRigidbody;
            basketBallBattleRoyale.gameState.hitsEnemyRed = "EnemyRed Leben: " + --hitsCounteEnemyRed;
            isRemoving = true;
        }
    }
    basketBallBattleRoyale.hndTriggerEnemyRed = hndTriggerEnemyRed;
    function hndTriggerEnemyMagenta(_event) {
        if (_event.cmpRigidbody.getContainer().name == "BasketBallPrefab") {
            _event.cmpRigidbody.getContainer().getComponent(basketBallBattleRoyale.BasketBallsController).isInUse = false;
            _event.cmpRigidbody.getContainer().getComponent(basketBallBattleRoyale.BasketBallsController).isInFlight = false;
            // tslint:disable-next-line: no-use-before-declare
            basketBallBattleRoyale.basketBalls.forEach(basketBall => {
                if (basketBall.getParent() == _event.cmpRigidbody.getContainer().getParent()) {
                    parentToRemove = _event.cmpRigidbody.getContainer().getParent();
                }
            });
            rgdBdyToRemove = _event.cmpRigidbody;
            basketBallBattleRoyale.gameState.hitsEnemyMagenta = "EnemyMagenta Leben: " + --hitsCounteEnemyMagenta;
            isRemoving = true;
        }
    }
    basketBallBattleRoyale.hndTriggerEnemyMagenta = hndTriggerEnemyMagenta;
    basketBallBattleRoyale.basketBalls = new Array(new fCore.Node(""));
    basketBallBattleRoyale.players = new Array(new fCore.Node(""));
    let cmpMeshFloorTiles = new Array(new fCore.ComponentMesh());
    let floorContainer;
    let staticEnvContainer;
    let basketBallContainer;
    let playersContainer;
    let collMeshesOfBasketStand = new Array(new fCore.ComponentMesh());
    let collMeshesOfBasketTrigger = new Array(new fCore.ComponentMesh());
    let rgdBdyEnemies = new Array(new fCore.ComponentRigidbody());
    let viewport;
    async function start(_event) {
        //initialisation
        await fCore.Project.loadResourcesFromHTML();
        basketBallBattleRoyale.bskBallRoot = (fCore.Project.resources["Graph|2021-06-02T10:15:15.171Z|84209"]);
        basketBallBattleRoyale.cmpCamera = new fCore.ComponentCamera();
        basketBallBattleRoyale.cmpCamera.clrBackground = fCore.Color.CSS("LIGHTSKYBLUE");
        basketBallBattleRoyale.cmpCamera.mtxPivot.translateY(2);
        basketBallBattleRoyale.canvas = document.querySelector("canvas");
        viewport = new fCore.Viewport();
        viewport.initialize("Viewport", basketBallBattleRoyale.bskBallRoot, basketBallBattleRoyale.cmpCamera, basketBallBattleRoyale.canvas);
        //get refrences of important tree hierachy objects
        staticEnvContainer = basketBallBattleRoyale.bskBallRoot.getChild(0);
        floorContainer = staticEnvContainer.getChild(0).getChild(0);
        let response = await fetch("./JSON/Config.json");
        let textResponse = await response.text();
        console.log(textResponse);
        //basketBalls
        basketBallContainer = basketBallBattleRoyale.bskBallRoot.getChild(1);
        basketBallBattleRoyale.basketBallGraphInstance = fCore.Project.resources["Graph|2021-06-10T09:58:39.176Z|64274"];
        playersContainer = basketBallContainer.getChild(0);
        for (let i = 0; i < playersContainer.getChildren().length; i++)
            basketBallBattleRoyale.players[i] = playersContainer.getChild(i).getChild(1);
        //create static Colliders and dynamic rigidbodies
        createandHandleRigidbodies();
        //initialize avatar
        let avatarController = new basketBallBattleRoyale.AvatarController(playersContainer, collMeshesOfBasketTrigger, basketBallBattleRoyale.players);
        avatarController.start();
        fCore.Physics.adjustTransforms(basketBallBattleRoyale.bskBallRoot, true);
        //deactivate pre build meshes from editor, only colliders were needed
        for (let collMeshBasket of collMeshesOfBasketStand) {
            collMeshBasket.activate(false);
            collMeshBasket.getContainer().getParent().getChild(0).activate(false);
        }
        for (let collMeshTrigger of collMeshesOfBasketTrigger)
            collMeshTrigger.activate(false);
        for (let cmpMeshFloorTile of cmpMeshFloorTiles)
            cmpMeshFloorTile.activate(false);
        basketBallBattleRoyale.Hud.start();
        updateGameState();
        fCore.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        fCore.Loop.start(fCore.LOOP_MODE.TIME_REAL, 60);
        console.log(basketBallBattleRoyale.bskBallRoot);
    }
    function updateGameState() {
        basketBallBattleRoyale.gameState.hitsAvatar = "Avatar Leben: " + hitsCounteAvatar;
        basketBallBattleRoyale.gameState.hitsEnemyBlue = "EnemyBlue Leben: " + hitsCounteEnemyBlue;
        basketBallBattleRoyale.gameState.hitsEnemyRed = "EnemyRed Leben: " + hitsCounteEnemyRed;
        basketBallBattleRoyale.gameState.hitsEnemyMagenta = "EnemyMagenta Leben: " + hitsCounteEnemyMagenta;
    }
    async function update() {
        ƒ.Physics.world.simulate(fCore.Loop.timeFrameReal / 1000);
        //sub functionality of triggers
        if (isRemoving) {
            removingTime -= fCore.Loop.timeFrameReal / 1000;
            if (removingTime <= 0) {
                basketBallBattleRoyale.basketBalls.splice(basketBallBattleRoyale.basketBalls.indexOf(parentToRemove.getChild(0)), 1);
                rgdBdyToRemove.getContainer().removeComponent(rgdBdyToRemove);
                basketBallContainer.getChild(1).removeChild(parentToRemove);
                isRemoving = false;
                removingTime = 1.5;
            }
        }
        //debug keyboard events
        if (basketBallBattleRoyale.players.length > checkBasketBallsAmount()) {
            let rndPos = new fCore.Vector3(new fCore.Random().getRange(-20, 20), new fCore.Random().getRange(20, 30), new fCore.Random().getRange(-20, 20));
            spawnBalls(rndPos);
        }
        if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.T]))
            fCore.Physics.settings.debugMode =
                fCore.Physics.settings.debugMode ==
                    fCore.PHYSICS_DEBUGMODE.JOINTS_AND_COLLIDER
                    ? fCore.PHYSICS_DEBUGMODE.PHYSIC_OBJECTS_ONLY
                    : fCore.PHYSICS_DEBUGMODE.JOINTS_AND_COLLIDER;
        if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.Y]))
            fCore.Physics.settings.debugDraw = !fCore.Physics.settings.debugDraw;
        viewport.draw();
    }
    async function spawnBalls(_rndPos) {
        let basketBallCloneGraph = await fCore.Project.createGraphInstance(basketBallBattleRoyale.basketBallGraphInstance);
        let dynamicRgdbdy = new fCore.ComponentRigidbody(25, fCore.PHYSICS_TYPE.DYNAMIC, fCore.COLLIDER_TYPE.SPHERE, fCore.PHYSICS_GROUP.GROUP_2);
        dynamicRgdbdy.friction = 1;
        dynamicRgdbdy.rotationInfluenceFactor = fCore.Vector3.Y(1);
        basketBallCloneGraph.getChild(0).addComponent(dynamicRgdbdy);
        basketBallContainer.getChild(1).appendChild(basketBallCloneGraph);
        dynamicRgdbdy.setPosition(_rndPos);
    }
    function checkBasketBallsAmount() {
        let i = 0;
        basketBallContainer.getChild(1).getChildren().forEach(basketBallGraphInstance => {
            basketBallBattleRoyale.basketBalls[i] = basketBallGraphInstance.getChild(0);
            i++;
        });
        return basketBallBattleRoyale.basketBalls.length;
    }
    function createandHandleRigidbodies() {
        //floorTiles
        let counterFloorTiles = 0;
        for (let floorTile of floorContainer.getChildren()) {
            if (counterFloorTiles == 0) {
                let staticRgdbdy = new fCore.ComponentRigidbody(0, fCore.PHYSICS_TYPE.STATIC, fCore.COLLIDER_TYPE.CYLINDER, fCore.PHYSICS_GROUP.DEFAULT);
                floorTile.addComponent(staticRgdbdy);
            }
            else {
                cmpMeshFloorTiles[counterFloorTiles] = floorTile.getComponent(fCore.ComponentMesh);
                let staticRgdbdy = new fCore.ComponentRigidbody(0, fCore.PHYSICS_TYPE.STATIC, fCore.COLLIDER_TYPE.CUBE, fCore.PHYSICS_GROUP.DEFAULT);
                floorTile.addComponent(staticRgdbdy);
            }
            counterFloorTiles++;
        }
        //Basket, Stand and other Colliders of Players 
        let counterStand = 0;
        let counterTrigger = 0;
        for (let player of playersContainer.getChildren()) {
            for (let containerOfMesh of player.getChildren()) {
                for (let mesh of containerOfMesh.getChildren()) {
                    if (mesh.name == "Mesh") {
                        for (let meshChild of mesh.getChild(1).getChildren()) {
                            let staticRgdbdy = new fCore.ComponentRigidbody(0, fCore.PHYSICS_TYPE.STATIC, fCore.COLLIDER_TYPE.CUBE, fCore.PHYSICS_GROUP.DEFAULT);
                            meshChild.addComponent(staticRgdbdy);
                        }
                        collMeshesOfBasketStand[counterStand] = mesh.getChild(0).getChild(1).getComponent(fCore.ComponentMesh);
                        counterStand++;
                        let staticRgdbdy = new fCore.ComponentRigidbody(0, fCore.PHYSICS_TYPE.STATIC, fCore.COLLIDER_TYPE.CUBE, fCore.PHYSICS_GROUP.DEFAULT);
                        let staticRgdbdy1 = new fCore.ComponentRigidbody(0, fCore.PHYSICS_TYPE.STATIC, fCore.COLLIDER_TYPE.CUBE, fCore.PHYSICS_GROUP.DEFAULT);
                        mesh.getChild(0).addComponent(staticRgdbdy);
                        mesh.getChild(0).getChild(0).addComponent(staticRgdbdy1);
                        let staticRgdbdy2 = new fCore.ComponentRigidbody(0, fCore.PHYSICS_TYPE.STATIC, fCore.COLLIDER_TYPE.CUBE, fCore.PHYSICS_GROUP.DEFAULT);
                        mesh.getChild(0).getChild(1).addComponent(staticRgdbdy2);
                        mesh.getChild(0).getChild(1).mtxWorld.translateZ(-2);
                    }
                    if (mesh.name == "Trigger") {
                        collMeshesOfBasketTrigger[counterTrigger] = mesh.getComponent(fCore.ComponentMesh);
                        let staticTrigger = new fCore.ComponentRigidbody(0, fCore.PHYSICS_TYPE.STATIC, fCore.COLLIDER_TYPE.CUBE, fCore.PHYSICS_GROUP.TRIGGER);
                        mesh.addComponent(staticTrigger);
                        switch (counterTrigger) {
                            case (0):
                                mesh.getComponent(fCore.ComponentRigidbody).addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, hndTriggerAvatar);
                                break;
                            case (1):
                                mesh.getComponent(fCore.ComponentRigidbody).addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, hndTriggerEnemyBlue);
                                break;
                            case (2):
                                mesh.getComponent(fCore.ComponentRigidbody).addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, hndTriggerEnemyRed);
                                break;
                            case (3):
                                mesh.getComponent(fCore.ComponentRigidbody).addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, hndTriggerEnemyMagenta);
                                break;
                        }
                        counterTrigger++;
                    }
                }
            }
        }
        //enemies rigidbodys
        let counterRgdBdy = 0;
        for (let player of playersContainer.getChildren()) {
            if (player.name != "AvatarsContainer") {
                let body = player.getChild(1);
                let dynamicEnemyRgdbdy = new fCore.ComponentRigidbody(75, fCore.PHYSICS_TYPE.DYNAMIC, fCore.COLLIDER_TYPE.CAPSULE, fCore.PHYSICS_GROUP.DEFAULT);
                dynamicEnemyRgdbdy.restitution = 0.1;
                dynamicEnemyRgdbdy.rotationInfluenceFactor = fCore.Vector3.ZERO();
                dynamicEnemyRgdbdy.friction = 100;
                body.addComponent(dynamicEnemyRgdbdy);
                // tslint:disable-next-line: no-unused-expression
                player.addComponent(new basketBallBattleRoyale.EnemiesController(player.getChild(1), player.getChild(0), dynamicEnemyRgdbdy, 10, collMeshesOfBasketTrigger));
                rgdBdyEnemies[counterRgdBdy] = dynamicEnemyRgdbdy;
                counterRgdBdy++;
            }
        }
    }
})(basketBallBattleRoyale || (basketBallBattleRoyale = {}));
//# sourceMappingURL=MainBasketBallCntrl.js.map