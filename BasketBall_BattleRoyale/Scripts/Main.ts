namespace basketBallBattleRoyale {

  import fCore = FudgeCore;
  let floorContainer: fCore.Node;
  let staticEnvContainer: fCore.Node;
  let basketBallContainer: fCore.Node;
  let basketBalls: fCore.Node[];
  let players: fCore.Node[];
  let avatarNode: fCore.Node;
  let childAvatarNode: fCore.Node;


  let collMeshesOfBasketStand: fCore.ComponentMesh[] = new Array(new fCore.ComponentMesh());
  let collMeshesOfBasketTrigger: fCore.ComponentMesh[] = new Array(new fCore.ComponentMesh());
  let cmpCamera: fCore.ComponentCamera;
  let cmpAvatar: fCore.ComponentRigidbody;


  let bskBallRoot: fCore.Graph;
  let canvas: HTMLCanvasElement;
  let viewport: fCore.Viewport;

  let isPointerInGame: boolean;

  let forwardMovement: number = 0;
  let backwardMovement: number = 0;
  let movementspeed: number = 3;
  let frictionFactor: number = 6;

  let kickStrength: number = 150;

  let distance: fCore.Vector3;

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
    cmpCamera.clrBackground = fCore.Color.CSS("CORNFLOWERBLUE");

    canvas = document.querySelector("canvas");
    viewport = new fCore.Viewport();
    viewport.initialize("Viewport", bskBallRoot, cmpCamera, canvas);

    //get refrences of important tree hierachy objects
    staticEnvContainer = bskBallRoot.getChild(0);
    floorContainer = staticEnvContainer.getChild(0).getChild(0);

    basketBallContainer = bskBallRoot.getChild(1);
    basketBalls = basketBallContainer.getChild(1).getChildren();
    players = basketBallContainer.getChild(0).getChildren();

    //call infrastrucstur functions
    createRigidbodies();
    createAvatar();
    fCore.Physics.adjustTransforms(bskBallRoot, true);

    //deactivate meshes from editor pre build, only colliders were needed
    for (let collMeshStand of collMeshesOfBasketStand)
      collMeshStand.activate(false);
    for (let collMeshTrigger of collMeshesOfBasketTrigger)
      collMeshTrigger.activate(false);

    //Hud.start();
    fCore.Loop.addEventListener(fCore.EVENT.LOOP_FRAME, update);
    fCore.Loop.start(fCore.LOOP_MODE.TIME_REAL, 60);
  }


  function update(): void {
    //functions with delta time
    ƒ.Physics.world.simulate(ƒ.Loop.timeFrameReal / 1000);
    player_Movement(fCore.Loop.timeFrameReal / 1000);
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
      basketBalls[0].getComponent(fCore.ComponentRigidbody).setVelocity(fCore.Vector3.ZERO());
      basketBalls[0].getComponent(fCore.ComponentRigidbody).setRotation(fCore.Vector3.ZERO());
      basketBalls[0].getComponent(fCore.ComponentRigidbody).setPosition(childAvatarNode.mtxWorld.translation);
      basketBalls[0].mtxWorld.translate(childAvatarNode.mtxWorld.translation);
    }
    //playerGrab--------------------
    viewport.draw();
    //fCore.AudioManager.default.update();
  }

  // function ParabelShot(projectile: fCore.ComponentTransform, target: fCore.ComponentTransform, decreasedAnglePerMeter: number, nearAngle: number, velocity: number): void {
  //   let rigidbody: fCore.ComponentRigidbody = basketBalls[0].getComponent(fCore.ComponentRigidbody);
  //   //if (rigidbody) rigidbody.physicsType = fCore.PHYSICS_TYPE.KINEMATIC;
  //   let up: fCore.Vector3 = fCore.Vector3.Y(1);

  //   let projectedOrigin: fCore.Vector3 = fCore.Vector3.CROSS(projectile.mtxLocal.translation, up);
  //   //Vector3.ProjectOnPlane(projectile.position, up);
  //   let projectedTarget: fCore.Vector3 = fCore.Vector3.CROSS(target.mtxLocal.translation, up);

  //   let projectedDirection: fCore.Vector3 = fCore.Vector3.SUM(projectedTarget, projectedOrigin);
  //   let targetRange: number = projectedDirection.magnitude;

  //   projectedDirection = new fCore.Vector3(projectedDirection.x / targetRange, projectedDirection.y / targetRange, projectedDirection.z / targetRange);

  //   let heightDifference: number = fCore.Vector3.DOT(projectile.mtxLocal.translation, up) - fCore.Vector3.DOT(target.mtxLocal.translation, up);
  //   let targetDistance: fCore.Vector3 = fCore.Vector3.DIFFERENCE(projectile.mtxLocal.translation, target.mtxLocal.translation);
  //   let firingAngle: number = nearAngle - targetDistance.magnitude * decreasedAnglePerMeter;
  //   let angleRad: number = firingAngle * Math.PI / 180;
  //   let startVelocity: number =
  //     (Math.sqrt(2) * targetRange * Math.sqrt(velocity) * Math.sqrt(1 / Math.sin(2 * angleRad))) /
  //     (Math.sqrt(2 * targetRange + (heightDifference * Math.sin(2 * angleRad) * (1 / Math.sin(angleRad)) * (1 / Math.sin(angleRad)))));
  //   let cache: fCore.Vector2 = new fCore.Vector2(Math.cos(angleRad), Math.sin(angleRad));
  //   let directedStartVelocity: fCore.Vector2 = new fCore.Vector2(startVelocity * cache.x, startVelocity * cache.y);
  //   let flightDuration: number = targetRange / directedStartVelocity.x;

  //   // tslint:disable-next-line: variable-name
  //   let elapse_time: number = 0;
  //   while (elapse_time < flightDuration) {
  //     console.log(new fCore.Vector3(0, (directedStartVelocity.y - (velocity * elapse_time)) * fCore.Loop.timeFrameGame, fCore.Loop.timeFrameGame).toString(), flightDuration.toString());
  //     rigidbody.setVelocity(new fCore.Vector3(0, (directedStartVelocity.y - (velocity * elapse_time)) / fCore.Loop.timeFrameGame, fCore.Loop.timeFrameGame));
  //     elapse_time += fCore.Loop.timeFrameGame;
  //     //ParabelShot(basketBalls[0].getComponent(fCore.ComponentTransform), players[0].getChild(0).getChild(1).getComponent(fCore.ComponentTransform), 1.5, 70, 85);
  //   }
  //   //if (rigidbody) rigidbody.physicsType = fCore.PHYSICS_TYPE.DYNAMIC;
  // }
  function createRigidbodies(): void {
    let dynamicRgdbdy: fCore.ComponentRigidbody = new fCore.ComponentRigidbody(
      25,
      fCore.PHYSICS_TYPE.DYNAMIC,
      fCore.COLLIDER_TYPE.SPHERE,
      fCore.PHYSICS_GROUP.GROUP_2
    );
    for (let floorTile of floorContainer.getChildren()) {
      let staticRgdbdy: fCore.ComponentRigidbody = new fCore.ComponentRigidbody(
        0,
        fCore.PHYSICS_TYPE.STATIC,
        fCore.COLLIDER_TYPE.CUBE,
        fCore.PHYSICS_GROUP.DEFAULT
      );
      floorTile.addComponent(staticRgdbdy);
    }

    for (let basketBall of basketBalls)
      basketBall.addComponent(dynamicRgdbdy);

    let counterStand: number = 0;
    let counterTrigger: number = 0;
    for (let player of players)
      for (let containerOfMesh of player.getChildren())
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
        fCore.Matrix4x4.TRANSLATION(fCore.Vector3.Y(2))
      )
    );
    childAvatarNode = new fCore.Node("childAvatarNode");
    childAvatarNode.addComponent(new fCore.ComponentTransform());
    childAvatarNode.mtxLocal.translate(new fCore.Vector3(0, 0, 2));

    avatarNode.appendChild(childAvatarNode);
    avatarNode.addComponent(cmpAvatar);
    avatarNode.addComponent(cmpCamera);

    bskBallRoot.appendChild(avatarNode);
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

        distance = fCore.Vector3.DIFFERENCE(basketBalls[0].mtxWorld.translation, avatarNode.mtxWorld.translation);
        if (distance.magnitude > 4)
          return;
        basketBalls[0].getComponent(fCore.ComponentRigidbody).setVelocity(fCore.Vector3.ZERO());
        basketBalls[0].getComponent(fCore.ComponentRigidbody).setRotation(fCore.Vector3.ZERO());
        isGrabbed = true;
      }
      if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.R]) && isGrabbed == true) {
        isGrabbed = false;
        let playerForward: fCore.Vector3;
        playerForward = fCore.Vector3.Z();
        playerForward.transform(avatarNode.mtxWorld, false);

        let distance: fCore.Vector3 = fCore.Vector3.DIFFERENCE(basketBalls[0].mtxWorld.translation, players[0].getChild(0).getChild(1).getComponent(fCore.ComponentMesh).mtxWorld.translation);
        console.log("aktuellePower: " + distance.magnitude * 25, "nur magnitude" + distance.magnitude)
        let trigger: fCore.Node = players[0].getChild(0).getChild(1);
        trigger.getComponent(fCore.ComponentRigidbody).addEventListener(fCore.EVENT_PHYSICS.TRIGGER_ENTER, hndTrigger)
        let distanceMag: number = distance.magnitude;
        if (distanceMag > 6)
          basketBalls[0].getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(
            new fCore.Vector3(playerForward.x * kickStrength, distanceMag * 25, playerForward.z * kickStrength),
            avatarNode.mtxWorld.translation);
        else
          basketBalls[0].getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(
            new fCore.Vector3(playerForward.x * kickStrength, 22 / distanceMag * 25, playerForward.z * kickStrength),
            avatarNode.mtxWorld.translation);
      }
    }
  }

  function hndTrigger(_event: ƒ.EventPhysics): void {
    if (players[0].getChild(0).getChild(1).getComponent(fCore.ComponentMesh).mtxWorld.translation.y < _event.cmpRigidbody.getContainer().getComponent(fCore.ComponentMesh).mtxWorld.translation.y)
      console.log(_event.cmpRigidbody.getContainer().name);
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
      avatarNode.mtxLocal.rotateY(-_event.movementX / 2);
      cmpAvatar.rotateBody(fCore.Vector3.Y(-_event.movementX / 2));
      //rotation for x axis on cmpCamera
      if (avatarNode.getComponent(fCore.ComponentCamera).mtxPivot.rotation.x >= -25 && avatarNode.getComponent(fCore.ComponentCamera).mtxPivot.rotation.x <= 30)
        avatarNode.getComponent(fCore.ComponentCamera).mtxPivot.rotateX(_event.movementY / 5);
      else if (avatarNode.getComponent(fCore.ComponentCamera).mtxPivot.rotation.x <= -25)
        avatarNode.getComponent(fCore.ComponentCamera).mtxPivot.rotateX(0.15);
      else if (avatarNode.getComponent(fCore.ComponentCamera).mtxPivot.rotation.x >= 30)
        avatarNode.getComponent(fCore.ComponentCamera).mtxPivot.rotateX(-0.15);
    }
    //player events----------------------------------
    //everthing which appends to player functionality-----------------
  }





}
