"use strict";
var basketBallBattleRoyale;
(function (basketBallBattleRoyale) {
    var fCore = FudgeCore;
    window.addEventListener("load", start);
    basketBallBattleRoyale.players = new Array(new fCore.Node(""));
    let cmpMeshFloorTiles = new Array(new fCore.ComponentMesh());
    let hitsCounteAvatar = 10;
    let hitsCounteEnemyBlue = 10;
    let hitsCounteEnemyRed = 10;
    let hitsCounteEnemyMagenta = 10;
    function hndTriggerAvatar(_event) {
        if (_event.cmpRigidbody.getContainer().name == "BasketBallPrefab")
            basketBallBattleRoyale.gameState.hitsAvatar = "Avatar Leben: " + --hitsCounteAvatar;
    }
    basketBallBattleRoyale.hndTriggerAvatar = hndTriggerAvatar;
    function hndTriggerEnemyBlue(_event) {
        if (_event.cmpRigidbody.getContainer().name == "BasketBallPrefab")
            basketBallBattleRoyale.gameState.hitsEnemyBlue = "EnemyBlue Leben: " + --hitsCounteEnemyBlue;
    }
    basketBallBattleRoyale.hndTriggerEnemyBlue = hndTriggerEnemyBlue;
    function hndTriggerEnemyRed(_event) {
        if (_event.cmpRigidbody.getContainer().name == "BasketBallPrefab")
            basketBallBattleRoyale.gameState.hitsEnemyRed = "EnemyRed Leben: " + --hitsCounteEnemyRed;
    }
    basketBallBattleRoyale.hndTriggerEnemyRed = hndTriggerEnemyRed;
    function hndTriggerEnemyMagenta(_event) {
        if (_event.cmpRigidbody.getContainer().name == "BasketBallPrefab")
            basketBallBattleRoyale.gameState.hitsEnemyMagenta = "EnemyMagenta Leben: " + --hitsCounteEnemyMagenta;
    }
    basketBallBattleRoyale.hndTriggerEnemyMagenta = hndTriggerEnemyMagenta;
    let floorContainer;
    let staticEnvContainer;
    let basketBallContainer;
    let playersContainer;
    let collMeshesOfBasketStand = new Array(new fCore.ComponentMesh());
    let collMeshesOfBasketTrigger = new Array(new fCore.ComponentMesh());
    let rgdBdyEnemies = new Array(new fCore.ComponentRigidbody());
    let bskBallRoot;
    let viewport;
    async function start(_event) {
        //initialisation
        await fCore.Project.loadResourcesFromHTML();
        bskBallRoot = (fCore.Project.resources["Graph|2021-06-02T10:15:15.171Z|84209"]);
        basketBallBattleRoyale.cmpCamera = new fCore.ComponentCamera();
        basketBallBattleRoyale.cmpCamera.clrBackground = fCore.Color.CSS("LIGHTSKYBLUE");
        basketBallBattleRoyale.cmpCamera.mtxPivot.translateY(2);
        basketBallBattleRoyale.canvas = document.querySelector("canvas");
        viewport = new fCore.Viewport();
        viewport.initialize("Viewport", bskBallRoot, basketBallBattleRoyale.cmpCamera, basketBallBattleRoyale.canvas);
        //get refrences of important tree hierachy objects
        staticEnvContainer = bskBallRoot.getChild(0);
        floorContainer = staticEnvContainer.getChild(0).getChild(0);
        basketBallContainer = bskBallRoot.getChild(1);
        basketBallBattleRoyale.basketBalls = basketBallContainer.getChild(1).getChildren();
        playersContainer = basketBallContainer.getChild(0);
        for (let i = 0; i < playersContainer.getChildren().length; i++)
            basketBallBattleRoyale.players[i] = playersContainer.getChild(i).getChild(1);
        //create static Colliders and dynamic rigidbodies
        //initialize avatar
        let avatarController = new basketBallBattleRoyale.AvatarController(playersContainer, collMeshesOfBasketTrigger, basketBallBattleRoyale.players);
        createandHandleRigidbodies();
        avatarController.start();
        fCore.Physics.adjustTransforms(bskBallRoot, true);
        //deactivate pre build meshes from editor, only colliders were needed
        for (let collMeshStand of collMeshesOfBasketStand)
            collMeshStand.activate(false);
        for (let collMeshTrigger of collMeshesOfBasketTrigger)
            collMeshTrigger.activate(false);
        for (let cmpMeshFloorTile of cmpMeshFloorTiles)
            cmpMeshFloorTile.activate(false);
        basketBallBattleRoyale.Hud.start();
        updateGameState();
        fCore.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        fCore.Loop.start(fCore.LOOP_MODE.TIME_REAL, 60);
        console.log(bskBallRoot);
    }
    function updateGameState() {
        basketBallBattleRoyale.gameState.hitsAvatar = "Avatar Leben: " + hitsCounteAvatar;
        basketBallBattleRoyale.gameState.hitsEnemyBlue = "EnemyBlue Leben: " + hitsCounteEnemyBlue;
        basketBallBattleRoyale.gameState.hitsEnemyRed = "EnemyRed Leben: " + hitsCounteEnemyRed;
        basketBallBattleRoyale.gameState.hitsEnemyMagenta = "EnemyMagenta Leben: " + hitsCounteEnemyMagenta;
    }
    function update() {
        ƒ.Physics.world.simulate(fCore.Loop.timeFrameReal / 1000);
        //debug keyboard events
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
    function createandHandleRigidbodies() {
        //floorTiles
        let counterFloorTiles = 0;
        for (let floorTile of floorContainer.getChildren()) {
            if (counterFloorTiles != 0)
                cmpMeshFloorTiles[counterFloorTiles] = floorTile.getComponent(fCore.ComponentMesh);
            let staticRgdbdy = new fCore.ComponentRigidbody(0, fCore.PHYSICS_TYPE.STATIC, fCore.COLLIDER_TYPE.CUBE, fCore.PHYSICS_GROUP.DEFAULT);
            floorTile.addComponent(staticRgdbdy);
            counterFloorTiles++;
        }
        //basketBalls
        let dynamicRgdbdy = new fCore.ComponentRigidbody(25, fCore.PHYSICS_TYPE.DYNAMIC, fCore.COLLIDER_TYPE.SPHERE, fCore.PHYSICS_GROUP.GROUP_2);
        for (let basketBall of basketBallBattleRoyale.basketBalls)
            basketBall.addComponent(dynamicRgdbdy);
        //Basket, Stand and other Colliders of Players 
        let counterStand = 0;
        let counterTrigger = 0;
        for (let player of playersContainer.getChildren()) {
            for (let containerOfMesh of player.getChildren()) {
                for (let mesh of containerOfMesh.getChildren()) {
                    if (mesh.name == "Mesh") {
                        collMeshesOfBasketStand[counterStand] = mesh.getComponent(fCore.ComponentMesh);
                        counterStand++;
                        let staticRgdbdy = new fCore.ComponentRigidbody(0, fCore.PHYSICS_TYPE.STATIC, fCore.COLLIDER_TYPE.CUBE, fCore.PHYSICS_GROUP.DEFAULT);
                        mesh.mtxLocal.translateY(-1.5);
                        mesh.addComponent(staticRgdbdy);
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
                player.addComponent(new basketBallBattleRoyale.EnemiesController(player.getChild(1), player.getChild(0), dynamicEnemyRgdbdy, 10, basketBallBattleRoyale.basketBalls, collMeshesOfBasketTrigger));
                rgdBdyEnemies[counterRgdBdy] = dynamicEnemyRgdbdy;
                counterRgdBdy++;
            }
        }
    }
})(basketBallBattleRoyale || (basketBallBattleRoyale = {}));
//# sourceMappingURL=MainBasketBallCntrl.js.map