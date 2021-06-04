namespace basketBallBattleRoyale {

  import fCore = FudgeCore;
  let floorContainer: fCore.Node;
  let staticEnvContainer: fCore.Node;
  let basketBallContainer: fCore.Node;
  let basketBalls: fCore.Node[];
  let players: fCore.Node[] = new Array(new fCore.Node(""));
  let playersContainer: fCore.Node;
  let avatarNode: fCore.Node;
  let childAvatarNode: fCore.Node;


  let collMeshesOfBasketStand: fCore.ComponentMesh[] = new Array(new fCore.ComponentMesh());
  let collMeshesOfBasketTrigger: fCore.ComponentMesh[] = new Array(new fCore.ComponentMesh());
  let rgdBdyEnemies: fCore.ComponentRigidbody[] = new Array(new fCore.ComponentRigidbody());
  let cmpCamera: fCore.ComponentCamera;
  let cmpAvatar: fCore.ComponentRigidbody;

  let oldRayHit: ƒ.RayHitInfo;
  let bskBallRoot: fCore.Graph;
  let canvas: HTMLCanvasElement;
  let viewport: fCore.Viewport;

  let isPointerInGame: boolean;

  let forwardMovement: number = 0;
  let backwardMovement: number = 0;
  let movementspeed: number = 4;
  let frictionFactor: number = 6;

  let throwStrength: number = 375;
  let hitCounter: number = 1;
  let targetPlayersName: string;
  let actualTarget: fCore.ComponentMesh;
  let isGrabbed: boolean;
  window.addEventListener("load", start);
  window.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mousedown", onPointerDown);
  document.addEventListener("pointerlockchange", pointerLockChange);


  async function start(_event: Event): Promise<void> {
    //initialisation
    await fCore.Project.loadResourcesFromHTML();

    bskBallRoot = <fCore.Graph>(
      fCore.Project.resources["Graph|2021-06-02T10:15:15.171Z|84209"]
    );
    cmpCamera = new fCore.ComponentCamera();
    cmpCamera.clrBackground = fCore.Color.CSS("GREY");
    cmpCamera.mtxPivot.translateY(2);

    canvas = document.querySelector("canvas");
    viewport = new fCore.Viewport();
    viewport.initialize("Viewport", bskBallRoot, cmpCamera, canvas);

    //get refrences of important tree hierachy objects
    staticEnvContainer = bskBallRoot.getChild(0);
    floorContainer = staticEnvContainer.getChild(0).getChild(0);

    basketBallContainer = bskBallRoot.getChild(1);
    basketBalls = basketBallContainer.getChild(1).getChildren();
    playersContainer = basketBallContainer.getChild(0);
    for (let i: number = 0; i < playersContainer.getChildren().length; i++)
      players[i] = playersContainer.getChild(i).getChild(1);


    //call infrastrucstur functions
    createRigidbodies();
    createAvatar();

    fCore.Physics.adjustTransforms(bskBallRoot, true);

    //deactivate meshes from editor pre build, only colliders were needed
    for (let collMeshStand of collMeshesOfBasketStand)
      collMeshStand.activate(false);
    for (let collMeshTrigger of collMeshesOfBasketTrigger)
      collMeshTrigger.activate(false);

    Hud.start();
    fCore.Loop.addEventListener(fCore.EVENT.LOOP_FRAME, update);
    fCore.Loop.start(fCore.LOOP_MODE.TIME_REAL, 60);
    console.log(bskBallRoot);
  }


  function update(): void {
    //functions with delta time
    ƒ.Physics.world.simulate(ƒ.Loop.timeFrameReal / 1000);
    player_Movement(fCore.Loop.timeFrameReal / 1000);
    enemy_Movement(fCore.Loop.timeFrameReal / 1000);
    isGrabbingObjects();
    handleKeys(fCore.Loop.timeFrameReal / 1000);

    //debug keyboard events
    if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.T]))
      fCore.Physics.settings.debugMode =
        fCore.Physics.settings.debugMode ==
          fCore.PHYSICS_DEBUGMODE.JOINTS_AND_COLLIDER
          ? fCore.PHYSICS_DEBUGMODE.PHYSIC_OBJECTS_ONLY
          : fCore.PHYSICS_DEBUGMODE.JOINTS_AND_COLLIDER;
    if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.Y]))
      fCore.Physics.settings.debugDraw = !fCore.Physics.settings.debugDraw;
    //------

    //playerGrab--------------------
    if (basketBalls != undefined)
      if (basketBalls[0].mtxWorld.translation.y < 0) {
        basketBalls[0].getComponent(fCore.ComponentRigidbody).setVelocity(fCore.Vector3.ZERO());
        basketBalls[0].getComponent(fCore.ComponentRigidbody).setRotation(fCore.Vector3.ZERO());
        basketBalls[0].getComponent(fCore.ComponentRigidbody).setPosition(new fCore.Vector3(0, 4, 0));
        basketBalls[0].mtxWorld.translate(new fCore.Vector3(0, 4, 0));
      }
    if (avatarNode.mtxWorld.translation.y < 0) {
      cmpAvatar.setVelocity(fCore.Vector3.ZERO());
      cmpAvatar.setRotation(fCore.Vector3.ZERO());
      cmpAvatar.setPosition(new fCore.Vector3(0, 4, 0));
      avatarNode.mtxWorld.translate(new fCore.Vector3(0, 4, 0));
    }

    if (isGrabbed) {
      targetPlayersName = targetChooserPlayer();
      basketBalls[0].getComponent(fCore.ComponentRigidbody).setVelocity(fCore.Vector3.ZERO());
      basketBalls[0].getComponent(fCore.ComponentRigidbody).setRotation(fCore.Vector3.ZERO());
      basketBalls[0].getComponent(fCore.ComponentRigidbody).setPosition(childAvatarNode.mtxWorld.translation);
      basketBalls[0].mtxWorld.translate(childAvatarNode.mtxWorld.translation);
    }

    //playerGrab--------------------
    viewport.draw();
  }

  function enemy_Movement(_deltaTime: number): void {
    rgdBdyEnemies.forEach(rgdBdyEnemy => {

      if (fCore.Vector3.DIFFERENCE(basketBalls[0].mtxWorld.translation, rgdBdyEnemy.getContainer().mtxWorld.translation).magnitude > 2)
        rgdBdyEnemy.applyLinearImpulse(new fCore.Vector3(basketBalls[0].mtxWorld.translation.x * 500, 0, basketBalls[0].mtxWorld.translation.z * 500));
    });
  }

  function createRigidbodies(): void {
    //floorTiles
    for (let floorTile of floorContainer.getChildren()) {
      let staticRgdbdy: fCore.ComponentRigidbody = new fCore.ComponentRigidbody(
        0,
        fCore.PHYSICS_TYPE.STATIC,
        fCore.COLLIDER_TYPE.CUBE,
        fCore.PHYSICS_GROUP.DEFAULT
      );
      floorTile.addComponent(staticRgdbdy);
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
            counterTrigger++;
            let staticTrigger: fCore.ComponentRigidbody = new fCore.ComponentRigidbody(
              0,
              fCore.PHYSICS_TYPE.STATIC,
              fCore.COLLIDER_TYPE.CUBE,
              fCore.PHYSICS_GROUP.TRIGGER
            );
            mesh.addComponent(staticTrigger);
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
          25,
          fCore.PHYSICS_TYPE.DYNAMIC,
          fCore.COLLIDER_TYPE.CUBE,
          fCore.PHYSICS_GROUP.GROUP_2
        );
        dynamicEnemyRgdbdy.restitution = 0.1;
        dynamicEnemyRgdbdy.rotationInfluenceFactor = fCore.Vector3.ZERO();
        dynamicEnemyRgdbdy.friction = 100;
        body.addComponent(dynamicEnemyRgdbdy);
        rgdBdyEnemies[counterRgdBdy] = dynamicEnemyRgdbdy;
        counterRgdBdy++;
      }
    }
  }

  //everthing which appends to player functionality-----------------
  function createAvatar(): void {
    cmpAvatar = new fCore.ComponentRigidbody(
      75,
      fCore.PHYSICS_TYPE.DYNAMIC,
      fCore.COLLIDER_TYPE.CAPSULE,
      fCore.PHYSICS_GROUP.DEFAULT
    );
    cmpAvatar.restitution = 0.1;
    cmpAvatar.rotationInfluenceFactor = fCore.Vector3.ZERO();
    cmpAvatar.friction = 100;


    avatarNode = new fCore.Node("AvatarNode");
    avatarNode.addComponent(
      new fCore.ComponentTransform(
        fCore.Matrix4x4.TRANSLATION(fCore.Vector3.Y(0))
      )
    );

    childAvatarNode = new fCore.Node("childAvatarNode");
    childAvatarNode.addComponent(new fCore.ComponentTransform());
    childAvatarNode.mtxLocal.translate(new fCore.Vector3(0, 2.5, 4.75));

    avatarNode.appendChild(childAvatarNode);
    avatarNode.addComponent(cmpAvatar);
    avatarNode.addComponent(cmpCamera);

    players[0].appendChild(avatarNode);
  }

  function player_Movement(_deltaTime: number): void {
    let playerForward: fCore.Vector3;
    playerForward = fCore.Vector3.Z();
    playerForward.transform(avatarNode.mtxWorld, false);

    let movementVelocity: fCore.Vector3 = new fCore.Vector3();
    movementVelocity.x =
      playerForward.x * (forwardMovement + backwardMovement) * movementspeed;
    movementVelocity.y = cmpAvatar.getVelocity().y;
    movementVelocity.z =
      playerForward.z * (forwardMovement + backwardMovement) * movementspeed;
    cmpAvatar.setVelocity(movementVelocity);
  }

  function isGrabbingObjects(): void {
    if (basketBalls != undefined) {
      if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.E])) {

        let distance: fCore.Vector3 = fCore.Vector3.DIFFERENCE(basketBalls[0].mtxWorld.translation, avatarNode.mtxWorld.translation);
        if (distance.magnitude > 6)
          return;
        basketBalls[0].getComponent(fCore.ComponentRigidbody).setVelocity(fCore.Vector3.ZERO());
        basketBalls[0].getComponent(fCore.ComponentRigidbody).setRotation(fCore.Vector3.ZERO());
        isGrabbed = true;

      }
      //which target was chosen from raycast-info
      if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.R]) && isGrabbed == true) {
        playersContainer.getChildren().forEach(player => {
          if (player.getChild(0).name == targetPlayersName)
            collMeshesOfBasketTrigger.forEach(trigger => {
              if (player.getChild(0).getChild(1) == trigger.getContainer())
                actualTarget = trigger;
            }); else return;

        });
        //check distance to basket
        let distance: fCore.Vector3 = fCore.Vector3.DIFFERENCE(basketBalls[0].mtxWorld.translation, actualTarget.mtxWorld.translation);
        let distanceMag: number = distance.magnitude;
        if (distanceMag < 6) return;
        isGrabbed = false;

        let playerForward: fCore.Vector3;
        playerForward = fCore.Vector3.Z();
        playerForward.transform(avatarNode.mtxWorld, false);

        actualTarget.getContainer().getComponent(fCore.ComponentRigidbody).addEventListener(fCore.EVENT_PHYSICS.TRIGGER_ENTER, hndTrigger);
        //diffrent powers for diffrent distances
        console.log(distanceMag);
        if (distanceMag > 16.5)
          basketBalls[0].getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(
            new fCore.Vector3(playerForward.x * throwStrength, distanceMag * 10, playerForward.z * throwStrength),
            avatarNode.mtxWorld.translation);
        else if (distanceMag > 10 && distanceMag < 16.5)
          basketBalls[0].getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(
            new fCore.Vector3(playerForward.x * throwStrength * 0.7, distanceMag * 15, playerForward.z * throwStrength * 0.7),
            avatarNode.mtxWorld.translation);
        else if (distanceMag < 10)
          basketBalls[0].getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(
            new fCore.Vector3(playerForward.x * throwStrength * 0.525, distanceMag * 23, playerForward.z * throwStrength * 0.525),
            avatarNode.mtxWorld.translation);
      }
    }
  }
  function targetChooserPlayer(): string {
    let mtxAvatar: ƒ.Matrix4x4 = cmpAvatar.getContainer().mtxWorld;
    let rayHit: ƒ.RayHitInfo = ƒ.Physics.raycast(ƒ.Vector3.DIFFERENCE(cmpAvatar.getPosition(), ƒ.Vector3.Y(0.5)), mtxAvatar.getZ(), 40);
    if (rayHit.rigidbodyComponent)
      if (rayHit.rigidbodyComponent.physicsType != fCore.PHYSICS_TYPE.DYNAMIC) {
        if (rayHit.rigidbodyComponent.getContainer().name != "Mesh") return "Wrong Target";
        let mesh: fCore.Node = rayHit.rigidbodyComponent.getContainer().getChild(0);
        mesh.getComponent(fCore.ComponentMaterial).clrPrimary.a = 1.5;
        mesh.getChildren().forEach(childMesh => {
          childMesh.getComponent(fCore.ComponentMaterial).clrPrimary.a = 1.5;
        });
        if (oldRayHit)
          if (oldRayHit.rigidbodyComponent != rayHit.rigidbodyComponent) {
            let oldMesh: fCore.Node = oldRayHit.rigidbodyComponent.getContainer().getChild(0);
            oldMesh.getComponent(fCore.ComponentMaterial).clrPrimary.a = 0.5;
            oldMesh.getChildren().forEach(childMesh => {
              childMesh.getComponent(fCore.ComponentMaterial).clrPrimary.a = 0.5;
            });
          }
        oldRayHit = rayHit;
        return rayHit.rigidbodyComponent.getContainer().getParent().name;
      }
      else return "No Target in focus";
    else
      return "RayHit ist no Rigidbody";

  }

  function hndTrigger(_event: ƒ.EventPhysics): void {
    if (collMeshesOfBasketTrigger[0].mtxWorld.translation.y < _event.cmpRigidbody.getContainer().getComponent(fCore.ComponentMesh).mtxWorld.translation.y)
      gameState.hits = "Hits: " + hitCounter++;
  }

  function handleKeys(_deltaTime: number): void {
    if (
      fCore.Keyboard.isPressedOne([
        fCore.KEYBOARD_CODE.W,
        fCore.KEYBOARD_CODE.ARROW_UP
      ])
    )
      forwardMovement = movementspeed;
    else if (forwardMovement >= 0) forwardMovement -= _deltaTime * frictionFactor;

    if (
      fCore.Keyboard.isPressedOne([
        fCore.KEYBOARD_CODE.S,
        fCore.KEYBOARD_CODE.ARROW_DOWN
      ])
    )
      backwardMovement = -movementspeed;
    else if (backwardMovement <= 0) backwardMovement += _deltaTime * frictionFactor;
  }

  //player events----------------------------------
  function onPointerDown(_event: MouseEvent): void {
    if (!isPointerInGame)
      canvas.requestPointerLock();
  }

  function pointerLockChange(_event: Event): void {
    if (!document.pointerLockElement)
      isPointerInGame = false;
    else
      isPointerInGame = true;
  }

  function onMouseMove(_event: MouseEvent): void {
    if (isPointerInGame) {
      //roatation for y axis on rgdbdy and mesh
      let rotFriction: number = 5;
      avatarNode.mtxLocal.rotateY(-_event.movementX / rotFriction);
      cmpAvatar.rotateBody(fCore.Vector3.Y(-_event.movementX / rotFriction));
      //rotation for x axis on cmpCamera
      let topRotLock: number = -25;
      let botRotLock: number = 30;
      let rotateBackPower: number = 0.15;
      if (avatarNode.getComponent(fCore.ComponentCamera).mtxPivot.rotation.x >= topRotLock && avatarNode.getComponent(fCore.ComponentCamera).mtxPivot.rotation.x <= botRotLock)
        avatarNode.getComponent(fCore.ComponentCamera).mtxPivot.rotateX(_event.movementY / rotFriction);
      else if (avatarNode.getComponent(fCore.ComponentCamera).mtxPivot.rotation.x <= topRotLock)
        avatarNode.getComponent(fCore.ComponentCamera).mtxPivot.rotateX(rotateBackPower);
      else if (avatarNode.getComponent(fCore.ComponentCamera).mtxPivot.rotation.x >= topRotLock)
        avatarNode.getComponent(fCore.ComponentCamera).mtxPivot.rotateX(-rotateBackPower);
    }
  }
  //player events----------------------------------
  //everthing which appends to player functionality-----------------
}
