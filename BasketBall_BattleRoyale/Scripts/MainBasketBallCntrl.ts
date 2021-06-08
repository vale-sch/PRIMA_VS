namespace basketBallBattleRoyale {

  import fCore = FudgeCore;
  window.addEventListener("load", start);

  export let basketBalls: fCore.Node[];
  export let players: fCore.Node[] = new Array(new fCore.Node(""));
  export let avatarNode: fCore.Node;
  export let cmpCamera: fCore.ComponentCamera;

  let cmpMeshFloorTiles: fCore.ComponentMesh[] = new Array(new fCore.ComponentMesh());

  let hitsCounteAvatar: number = 10;
  let hitsCounteEnemyBlue: number = 10;
  let hitsCounteEnemyRed: number = 10;
  let hitsCounteEnemyMagenta: number = 10;
  export function hndTriggerAvatar(_event: fCore.EventPhysics): void {
    if (_event.cmpRigidbody.getContainer().name == "BasketBallPrefab")
      gameState.hitsAvatar = "Avatar Leben: " + --hitsCounteAvatar;
  }
  export function hndTriggerEnemyBlue(_event: fCore.EventPhysics): void {
    if (_event.cmpRigidbody.getContainer().name == "BasketBallPrefab")
      gameState.hitsEnemyBlue = "EnemyBlue Leben: " + --hitsCounteEnemyBlue;
  }
  export function hndTriggerEnemyRed(_event: fCore.EventPhysics): void {
    if (_event.cmpRigidbody.getContainer().name == "BasketBallPrefab")
      gameState.hitsEnemyRed = "EnemyRed Leben: " + --hitsCounteEnemyRed;
  }
  export function hndTriggerEnemyMagenta(_event: fCore.EventPhysics): void {
    if (_event.cmpRigidbody.getContainer().name == "BasketBallPrefab")
      gameState.hitsEnemyMagenta = "EnemyMagenta Leben: " + --hitsCounteEnemyMagenta;
  }

  let floorContainer: fCore.Node;
  let staticEnvContainer: fCore.Node;
  let basketBallContainer: fCore.Node;
  let playersContainer: fCore.Node;

  let collMeshesOfBasketStand: fCore.ComponentMesh[] = new Array(new fCore.ComponentMesh());
  let collMeshesOfBasketTrigger: fCore.ComponentMesh[] = new Array(new fCore.ComponentMesh());
  let rgdBdyEnemies: fCore.ComponentRigidbody[] = new Array(new fCore.ComponentRigidbody());

  let bskBallRoot: fCore.Graph;
  export let canvas: HTMLCanvasElement;
  let viewport: fCore.Viewport;

  async function start(_event: Event): Promise<void> {
    //initialisation
    await fCore.Project.loadResourcesFromHTML();

    bskBallRoot = <fCore.Graph>(
      fCore.Project.resources["Graph|2021-06-02T10:15:15.171Z|84209"]
    );
    cmpCamera = new fCore.ComponentCamera();
    cmpCamera.clrBackground = fCore.Color.CSS("LIGHTSKYBLUE");
    cmpCamera.mtxPivot.translateY(2);

    canvas = document.querySelector("canvas");
    viewport = new fCore.Viewport();
    viewport.initialize("Viewport", bskBallRoot, cmpCamera, canvas);

    //get refrences of important tree hierachy objects
    staticEnvContainer = bskBallRoot.getChild(0);
    floorContainer = staticEnvContainer.getChild(0).getChild(0);

    let response: Response = await fetch("./JSON/Config.json");
    let textResponse: string = await response.text();
    console.log(textResponse);

    basketBallContainer = bskBallRoot.getChild(1);
    basketBalls = basketBallContainer.getChild(1).getChildren();
    playersContainer = basketBallContainer.getChild(0);
    for (let i: number = 0; i < playersContainer.getChildren().length; i++)
      players[i] = playersContainer.getChild(i).getChild(1);


    //create static Colliders and dynamic rigidbodies
    //initialize avatar
    let avatarController: AvatarController = new AvatarController(playersContainer, collMeshesOfBasketTrigger, players);

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
    Hud.start();
    updateGameState();


    fCore.Loop.addEventListener(fCore.EVENT.LOOP_FRAME, update);
    fCore.Loop.start(fCore.LOOP_MODE.TIME_REAL, 60);

    console.log(bskBallRoot);
  }
  function updateGameState(): void {

    gameState.hitsAvatar = "Avatar Leben: " + hitsCounteAvatar;
    gameState.hitsEnemyBlue = "EnemyBlue Leben: " + hitsCounteEnemyBlue;
    gameState.hitsEnemyRed = "EnemyRed Leben: " + hitsCounteEnemyRed;
    gameState.hitsEnemyMagenta = "EnemyMagenta Leben: " + hitsCounteEnemyMagenta;
  }

  function update(): void {
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

  function createandHandleRigidbodies(): void {
    //floorTiles
    let counterFloorTiles: number = 0;
    for (let floorTile of floorContainer.getChildren()) {
      if (counterFloorTiles == 0) {

        let staticRgdbdy: fCore.ComponentRigidbody = new fCore.ComponentRigidbody(
          0,
          fCore.PHYSICS_TYPE.STATIC,
          fCore.COLLIDER_TYPE.CYLINDER,
          fCore.PHYSICS_GROUP.DEFAULT
        );
        floorTile.addComponent(staticRgdbdy);
      } else {
        cmpMeshFloorTiles[counterFloorTiles] = floorTile.getComponent(fCore.ComponentMesh);
        let staticRgdbdy: fCore.ComponentRigidbody = new fCore.ComponentRigidbody(
          0,
          fCore.PHYSICS_TYPE.STATIC,
          fCore.COLLIDER_TYPE.CUBE,
          fCore.PHYSICS_GROUP.DEFAULT
        );
        floorTile.addComponent(staticRgdbdy);
      }
      counterFloorTiles++;
    }

    //basketBalls
    let dynamicRgdbdy: fCore.ComponentRigidbody = new fCore.ComponentRigidbody(
      25,
      fCore.PHYSICS_TYPE.DYNAMIC,
      fCore.COLLIDER_TYPE.SPHERE,
      fCore.PHYSICS_GROUP.GROUP_2
    );
    for (let basketBall of basketBalls)
      basketBall.addComponent(dynamicRgdbdy);

    //Basket, Stand and other Colliders of Players 
    let counterStand: number = 0;
    let counterTrigger: number = 0;
    for (let player of playersContainer.getChildren()) {
      for (let containerOfMesh of player.getChildren()) {
        for (let mesh of containerOfMesh.getChildren()) {
          if (mesh.name == "Mesh") {
            collMeshesOfBasketStand[counterStand] = mesh.getComponent(fCore.ComponentMesh);
            counterStand++;
            let staticRgdbdy: fCore.ComponentRigidbody = new fCore.ComponentRigidbody(
              0,
              fCore.PHYSICS_TYPE.STATIC,
              fCore.COLLIDER_TYPE.CUBE,
              fCore.PHYSICS_GROUP.DEFAULT
            );
            mesh.mtxLocal.translateY(-1.5);
            mesh.addComponent(staticRgdbdy);
          }
          if (mesh.name == "Trigger") {
            collMeshesOfBasketTrigger[counterTrigger] = mesh.getComponent(fCore.ComponentMesh);
            let staticTrigger: fCore.ComponentRigidbody = new fCore.ComponentRigidbody(
              0,
              fCore.PHYSICS_TYPE.STATIC,
              fCore.COLLIDER_TYPE.CUBE,
              fCore.PHYSICS_GROUP.TRIGGER
            );

            mesh.addComponent(staticTrigger);
            switch (counterTrigger) {
              case (0):
                mesh.getComponent(fCore.ComponentRigidbody).addEventListener(fCore.EVENT_PHYSICS.TRIGGER_ENTER, hndTriggerAvatar);
                break;
              case (1):
                mesh.getComponent(fCore.ComponentRigidbody).addEventListener(fCore.EVENT_PHYSICS.TRIGGER_ENTER, hndTriggerEnemyBlue);
                break;
              case (2):
                mesh.getComponent(fCore.ComponentRigidbody).addEventListener(fCore.EVENT_PHYSICS.TRIGGER_ENTER, hndTriggerEnemyRed);
                break;
              case (3):
                mesh.getComponent(fCore.ComponentRigidbody).addEventListener(fCore.EVENT_PHYSICS.TRIGGER_ENTER, hndTriggerEnemyMagenta);
                break;
            }
            counterTrigger++;
          }
        }
      }
    }

    //enemies rigidbodys
    let counterRgdBdy: number = 0;
    for (let player of playersContainer.getChildren()) {
      if (player.name != "AvatarsContainer") {

        let body: fCore.Node = player.getChild(1);
        let dynamicEnemyRgdbdy: fCore.ComponentRigidbody = new fCore.ComponentRigidbody(
          75,
          fCore.PHYSICS_TYPE.DYNAMIC,
          fCore.COLLIDER_TYPE.CAPSULE,
          fCore.PHYSICS_GROUP.DEFAULT
        );
        dynamicEnemyRgdbdy.restitution = 0.1;
        dynamicEnemyRgdbdy.rotationInfluenceFactor = fCore.Vector3.ZERO();
        dynamicEnemyRgdbdy.friction = 100;
        body.addComponent(dynamicEnemyRgdbdy);

        // tslint:disable-next-line: no-unused-expression
        player.addComponent(new EnemiesController(player.getChild(1), player.getChild(0), dynamicEnemyRgdbdy, 10, basketBalls, collMeshesOfBasketTrigger));
        rgdBdyEnemies[counterRgdBdy] = dynamicEnemyRgdbdy;
        counterRgdBdy++;
      }
    }
  }
}
