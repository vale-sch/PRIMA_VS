namespace basketBallBattleRoyale {

  import fCore = FudgeCore;
  window.addEventListener("load", start);

  let hitsCounteAvatar: number = 10;
  let hitsCounteEnemyBlue: number = 10;
  let hitsCounteEnemyRed: number = 10;
  let hitsCounteEnemyMagenta: number = 10;
  let parentToRemove: fCore.Node;
  let isRemoving: boolean = false;
  let removingTime: number = 1.5;
  let rgdBdyToRemove: fCore.ComponentRigidbody;

  export function hndTriggerAvatar(_event: fCore.EventPhysics): void {
    if (_event.cmpRigidbody.getContainer().name == "BasketBallPrefab") {
      _event.cmpRigidbody.getContainer().getComponent(BasketBallsController).isInUse = false;
      _event.cmpRigidbody.getContainer().getComponent(BasketBallsController).isInFlight = false;
      // tslint:disable-next-line: no-use-before-declare
      basketBalls.forEach(basketBall => {
        if (basketBall.getParent() == _event.cmpRigidbody.getContainer().getParent()) {
          parentToRemove = _event.cmpRigidbody.getContainer().getParent();
        }
      });
      rgdBdyToRemove = _event.cmpRigidbody;
      gameState.hitsAvatar = "Avatar Leben: " + --hitsCounteAvatar;
      isRemoving = true;

    }
  }

  export function hndTriggerEnemyBlue(_event: fCore.EventPhysics): void {
    if (_event.cmpRigidbody.getContainer().name == "BasketBallPrefab") {
      _event.cmpRigidbody.getContainer().getComponent(BasketBallsController).isInUse = false;
      _event.cmpRigidbody.getContainer().getComponent(BasketBallsController).isInFlight = false;

      // tslint:disable-next-line: no-use-before-declare
      basketBalls.forEach(basketBall => {
        if (basketBall.getParent() == _event.cmpRigidbody.getContainer().getParent()) {
          parentToRemove = _event.cmpRigidbody.getContainer().getParent();
        }
      });
      rgdBdyToRemove = _event.cmpRigidbody;
      gameState.hitsEnemyBlue = "EnemyBlue Leben: " + --hitsCounteEnemyBlue;
      isRemoving = true;
    }
  }

  export function hndTriggerEnemyRed(_event: fCore.EventPhysics): void {
    if (_event.cmpRigidbody.getContainer().name == "BasketBallPrefab") {
      _event.cmpRigidbody.getContainer().getComponent(BasketBallsController).isInUse = false;
      _event.cmpRigidbody.getContainer().getComponent(BasketBallsController).isInFlight = false;

      // tslint:disable-next-line: no-use-before-declare
      basketBalls.forEach(basketBall => {
        if (basketBall.getParent() == _event.cmpRigidbody.getContainer().getParent()) {
          parentToRemove = _event.cmpRigidbody.getContainer().getParent();
        }
      });
      rgdBdyToRemove = _event.cmpRigidbody;
      gameState.hitsEnemyRed = "EnemyRed Leben: " + --hitsCounteEnemyRed;
      isRemoving = true;
    }
  }

  export function hndTriggerEnemyMagenta(_event: fCore.EventPhysics): void {
    if (_event.cmpRigidbody.getContainer().name == "BasketBallPrefab") {
      _event.cmpRigidbody.getContainer().getComponent(BasketBallsController).isInUse = false;
      _event.cmpRigidbody.getContainer().getComponent(BasketBallsController).isInFlight = false;

      // tslint:disable-next-line: no-use-before-declare
      basketBalls.forEach(basketBall => {
        if (basketBall.getParent() == _event.cmpRigidbody.getContainer().getParent()) {
          parentToRemove = _event.cmpRigidbody.getContainer().getParent();
        }
      });
      rgdBdyToRemove = _event.cmpRigidbody;
      gameState.hitsEnemyMagenta = "EnemyMagenta Leben: " + --hitsCounteEnemyMagenta; isRemoving = true;
    }
  }

  export let basketBallGraphInstance: fCore.Graph;
  export let basketBalls: fCore.Node[] = new Array(new fCore.Node(""));
  export let players: fCore.Node[] = new Array(new fCore.Node(""));
  export let avatarNode: fCore.Node;
  export let cmpCamera: fCore.ComponentCamera;
  export let bskBallRoot: fCore.Graph;
  export let canvas: HTMLCanvasElement;

  let cmpMeshFloorTiles: fCore.ComponentMesh[] = new Array(new fCore.ComponentMesh());


  let floorContainer: fCore.Node;
  let staticEnvContainer: fCore.Node;
  let basketBallContainer: fCore.Node;
  let playersContainer: fCore.Node;

  let collMeshesOfBasketStand: fCore.ComponentMesh[] = new Array(new fCore.ComponentMesh());
  let collMeshesOfBasketTrigger: fCore.ComponentMesh[] = new Array(new fCore.ComponentMesh());
  let rgdBdyEnemies: fCore.ComponentRigidbody[] = new Array(new fCore.ComponentRigidbody());



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


    //basketBalls
    basketBallContainer = bskBallRoot.getChild(1);
    basketBallGraphInstance = <fCore.Graph>fCore.Project.resources["Graph|2021-06-10T09:58:39.176Z|64274"];


    playersContainer = basketBallContainer.getChild(0);
    for (let i: number = 0; i < playersContainer.getChildren().length; i++)
      players[i] = playersContainer.getChild(i).getChild(1);


    //create static Colliders and dynamic rigidbodies
    createandHandleRigidbodies();
    //initialize avatar
    let avatarController: AvatarController = new AvatarController(playersContainer, collMeshesOfBasketTrigger, players);

    avatarController.start();
    fCore.Physics.adjustTransforms(bskBallRoot, true);

    //deactivate pre build meshes from editor, only colliders were needed
    for (let collMeshBasket of collMeshesOfBasketStand) {
      collMeshBasket.activate(false);
      collMeshBasket.getContainer().getParent().getChild(0).activate(false);
    }

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

  async function update(): Promise<void> {
    ƒ.Physics.world.simulate(fCore.Loop.timeFrameReal / 1000);
    //sub functionality of triggers
    if (isRemoving) {
      removingTime -= fCore.Loop.timeFrameReal / 1000;
      if (removingTime <= 0) {
        basketBalls.splice(basketBalls.indexOf(parentToRemove.getChild(0)), 1);
        rgdBdyToRemove.getContainer().removeComponent(rgdBdyToRemove);
        basketBallContainer.getChild(1).removeChild(parentToRemove);

        isRemoving = false;
        removingTime = 1.5;
      }
    }

    //debug keyboard events
    if (players.length > checkBasketBallsAmount()) {
      let rndPos: fCore.Vector3 = new fCore.Vector3(new fCore.Random().getRange(-20, 20), new fCore.Random().getRange(20, 30), new fCore.Random().getRange(-20, 20));
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
  async function spawnBalls(_rndPos: fCore.Vector3): Promise<void> {
    let basketBallCloneGraph: fCore.GraphInstance = await fCore.Project.createGraphInstance(basketBallGraphInstance);
    let dynamicRgdbdy: fCore.ComponentRigidbody = new fCore.ComponentRigidbody(
      25,
      fCore.PHYSICS_TYPE.DYNAMIC,
      fCore.COLLIDER_TYPE.SPHERE,
      fCore.PHYSICS_GROUP.GROUP_2
    );
    dynamicRgdbdy.friction = 1;
    dynamicRgdbdy.rotationInfluenceFactor = fCore.Vector3.Y(1);


    basketBallCloneGraph.getChild(0).addComponent(dynamicRgdbdy);
    basketBallContainer.getChild(1).appendChild(basketBallCloneGraph);

    dynamicRgdbdy.setPosition(_rndPos);

  }

  function checkBasketBallsAmount(): number {
    let i: number = 0;
    basketBallContainer.getChild(1).getChildren().forEach(basketBallGraphInstance => {
      basketBalls[i] = basketBallGraphInstance.getChild(0);
      i++;
    });
    return basketBalls.length;
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

    //Basket, Stand and other Colliders of Players 
    let counterStand: number = 0;
    let counterTrigger: number = 0;
    for (let player of playersContainer.getChildren()) {
      for (let containerOfMesh of player.getChildren()) {
        for (let mesh of containerOfMesh.getChildren()) {
          if (mesh.name == "Mesh") {
            for (let meshChild of mesh.getChild(1).getChildren()) {
              let staticRgdbdy: fCore.ComponentRigidbody = new fCore.ComponentRigidbody(
                0,
                fCore.PHYSICS_TYPE.STATIC,
                fCore.COLLIDER_TYPE.CUBE,
                fCore.PHYSICS_GROUP.DEFAULT
              );
              meshChild.addComponent(staticRgdbdy);
            }

            collMeshesOfBasketStand[counterStand] = mesh.getChild(0).getChild(1).getComponent(fCore.ComponentMesh);
            counterStand++;
            let staticRgdbdy: fCore.ComponentRigidbody = new fCore.ComponentRigidbody(
              0,
              fCore.PHYSICS_TYPE.STATIC,
              fCore.COLLIDER_TYPE.CUBE,
              fCore.PHYSICS_GROUP.DEFAULT
            );
            let staticRgdbdy1: fCore.ComponentRigidbody = new fCore.ComponentRigidbody(
              0,
              fCore.PHYSICS_TYPE.STATIC,
              fCore.COLLIDER_TYPE.CUBE,
              fCore.PHYSICS_GROUP.DEFAULT
            );
            mesh.getChild(0).addComponent(staticRgdbdy);
            mesh.getChild(0).getChild(0).addComponent(staticRgdbdy1);
            let staticRgdbdy2: fCore.ComponentRigidbody = new fCore.ComponentRigidbody(
              0,
              fCore.PHYSICS_TYPE.STATIC,
              fCore.COLLIDER_TYPE.CUBE,
              fCore.PHYSICS_GROUP.DEFAULT
            );
            mesh.getChild(0).getChild(1).addComponent(staticRgdbdy2);
            mesh.getChild(0).getChild(1).mtxWorld.translateZ(-2);
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
        player.addComponent(new EnemiesController(player.getChild(1), player.getChild(0), dynamicEnemyRgdbdy, 10, collMeshesOfBasketTrigger));
        rgdBdyEnemies[counterRgdBdy] = dynamicEnemyRgdbdy;
        counterRgdBdy++;
      }
    }
  }
}
