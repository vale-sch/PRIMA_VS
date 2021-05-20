namespace L05_PhysicsGame {
  import fCore = FudgeCore;
  // import fAid = FudgeAid;
  let audioBackground: fCore.Audio = new fCore.Audio("./Audio/backgroundmusic.mp3");
  let audioGrab: fCore.Audio = new fCore.Audio("./Audio/grab.wav");
  let audioShoot: fCore.Audio = new fCore.Audio("./Audio/shoot.wav");

  let cmpCamera: fCore.ComponentCamera;
  let cmpAvatar: fCore.ComponentRigidbody;
  let cmpRigidbodyBall: fCore.ComponentRigidbody;
  let cmpAudioGrab: fCore.ComponentAudio = new fCore.ComponentAudio(audioGrab);
  let cmpAudioShoot: fCore.ComponentAudio = new fCore.ComponentAudio(audioShoot);

  let ball: fCore.Node;
  let avatarNode: fCore.Node;
  let childAvatarNode: fCore.Node;
  let rootGraph: fCore.Graph;
  let viewport: fCore.Viewport;

  let forwardMovement: number = 0;
  let backwardMovement: number = 0;
  let movementspeed: number = 25;
  let playerJumpForce: number = 450;
  let kickStrength: number = 750;

  let distance: fCore.Vector3;

  let isGrounded: boolean;
  let isGrabbed: boolean;
  let isPointerInGame: boolean;

  let canvas: HTMLCanvasElement;
  window.addEventListener("load", start);
  window.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mousedown", onPointerDown);
  document.addEventListener("pointerlockchange", pointerLockChange);

  async function start(_event: Event): Promise<void> {
    await FudgeCore.Project.loadResourcesFromHTML();
    // await FudgeCore.Project.loadResources("PhysicsGame.json");
    FudgeCore.Debug.log("Project:", FudgeCore.Project.resources);
    // pick the graph to show
    rootGraph = <fCore.Graph>FudgeCore.Project.resources["Graph|2021-04-27T14:37:42.239Z|64317"];

    cmpCamera = new fCore.ComponentCamera();
    cmpCamera.clrBackground = fCore.Color.CSS("DEEPSKYBLUE");
    cmpCamera.mtxPivot.translateY(1);

    createAvatar();
    setupAudio();
    createRigidbodies();

    canvas = document.querySelector("canvas");
    viewport = new fCore.Viewport();
    viewport.initialize("Viewport", rootGraph, cmpCamera, canvas);
    Hud.start();

    fCore.Loop.addEventListener(fCore.EVENT.LOOP_FRAME, update);
    fCore.Loop.start(fCore.LOOP_MODE.TIME_REAL, 60);
  }

  export class BallBouncerCmp extends ƒ.ComponentScript {
    constructor() {
      super();
      console.log("BallBouncer created");
      this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndComponentAdd);
      // ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.hndTimer);
      ƒ.Time.game.setTimer(50, 0, this.hndTimer);
    }
    public hndTimer = (_event: ƒ.EventTimer): void => {
      // console.log("Timer", this);
      let ballBdy: ƒ.ComponentRigidbody = this.getContainer().getComponent(ƒ.ComponentRigidbody);
      let randomNumber: Number = ƒ.Random.default.getRangeFloored(0, 3);
      if (!isGrabbed)
        switch (randomNumber) {
          case 0:
            ballBdy.applyLinearImpulse(fCore.Vector3.Y(ƒ.Random.default.getRangeFloored(5, 40)));
            ballBdy.rotateBody(fCore.Vector3.X(ƒ.Random.default.getRangeFloored(-360, 360)));
            break;
          case 1:
            ballBdy.applyLinearImpulse(fCore.Vector3.X(ƒ.Random.default.getRangeFloored(-15, 15)));
            ballBdy.rotateBody(fCore.Vector3.Y(ƒ.Random.default.getRangeFloored(-360, 360)));
            break;
          case 2:
            break;
        }
    }
    public hndComponentAdd(_event: Event): void {
      console.log("ComponentAdd");
      // this.getContainer().addEventListener(ƒ.EVENT.RENDER_PREPARE_START, (_event: Event): void => console.log("Render"));
    }
  }

  export class StaticRotateCmp extends ƒ.ComponentScript {
    constructor() {
      super();
      console.log("StaticRotate created");
      this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndComponentAdd);
      // ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.hndTimer);
      ƒ.Time.game.setTimer(1000, 0, this.hndTimer);
    }
    public hndTimer = (_event: ƒ.EventTimer): void => {
      // console.log("Timer", this);
      let staticBdy: ƒ.ComponentRigidbody = this.getContainer().getComponent(ƒ.ComponentRigidbody);
      switch (ƒ.Random.default.getRangeFloored(0, 5)) {
        case 0:
          staticBdy.rotateBody(fCore.Vector3.X(ƒ.Random.default.getRangeFloored(0, 180)));
          break;
        case 1:
          staticBdy.rotateBody(fCore.Vector3.Y(ƒ.Random.default.getRangeFloored(-180, 180)));
          break;
        case 2:
          staticBdy.rotateBody(fCore.Vector3.Z(ƒ.Random.default.getRangeFloored(-180, 180)));
          break;
        case 3:
          staticBdy.rotateBody(fCore.Vector3.X(ƒ.Random.default.getRangeFloored(-180, 0)));
          break;
        case 4:
          break;
      }
    }
    public hndComponentAdd(_event: Event): void {
      console.log("ComponentAdd");
      // this.getContainer().addEventListener(ƒ.EVENT.RENDER_PREPARE_START, (_event: Event): void => console.log("Render"));
    }
  }

  function createAvatar(): void {
    cmpAvatar = new fCore.ComponentRigidbody(75, fCore.PHYSICS_TYPE.DYNAMIC, fCore.COLLIDER_TYPE.CAPSULE, fCore.PHYSICS_GROUP.DEFAULT);
    cmpAvatar.restitution = 0.5;
    cmpAvatar.rotationInfluenceFactor = fCore.Vector3.ZERO();
    cmpAvatar.friction = 1;

    avatarNode = new fCore.Node("AvatarNode");
    avatarNode.addComponent(new fCore.ComponentTransform(fCore.Matrix4x4.TRANSLATION(fCore.Vector3.Y(3))));
    avatarNode.addComponent(cmpAvatar);
    avatarNode.addComponent(cmpCamera);

    childAvatarNode = new fCore.Node("childAvatarNode");
    childAvatarNode.addComponent(new fCore.ComponentTransform());
    childAvatarNode.mtxLocal.translate(new fCore.Vector3(0, 0.75, 5));

    avatarNode.appendChild(childAvatarNode);
    rootGraph.appendChild(avatarNode);
  }

  function setupAudio(): void {
    let cmpListener: fCore.ComponentAudioListener = new fCore.ComponentAudioListener();
    cmpCamera.getContainer().addComponent(cmpListener);

    let audioNode: fCore.Node = new fCore.Node("audioNode");
    let cmpAudioBackground: fCore.ComponentAudio = new fCore.ComponentAudio(audioBackground, true, true);

    cmpAudioBackground.volume = 0.2;
    audioNode.addComponent(cmpAudioBackground);
    audioNode.addComponent(cmpAudioGrab);
    audioNode.addComponent(cmpAudioShoot);
    avatarNode.appendChild(audioNode);

    fCore.AudioManager.default.listenWith(cmpListener);
    fCore.AudioManager.default.listenTo(rootGraph);
  }

  function update(): void {
    fCore.Physics.world.simulate(fCore.Loop.timeFrameReal / 1000);

    playerIsGroundedRaycast();
    isGrabbingObjects();

    handleKeys(fCore.Loop.timeFrameReal / 1000);
    player_Movement(fCore.Loop.timeFrameReal / 1000);

    viewport.draw();
    fCore.AudioManager.default.update();

    if (ball != undefined)
      if (ball.mtxWorld.translation.y < 0) {
        cmpRigidbodyBall.setVelocity(fCore.Vector3.ZERO());
        cmpRigidbodyBall.setRotation(fCore.Vector3.ZERO());
        cmpRigidbodyBall.setPosition(new fCore.Vector3(0, 4, 0));
        ball.mtxWorld.translate(new fCore.Vector3(0, 4, 0));
      }
    if (avatarNode.mtxWorld.translation.y < 0) {
      cmpAvatar.setVelocity(fCore.Vector3.ZERO());
      cmpAvatar.setRotation(fCore.Vector3.ZERO());
      cmpAvatar.setPosition(new fCore.Vector3(0, 4, 0));
      avatarNode.mtxWorld.translate(new fCore.Vector3(0, 4, 0));
    }

    if (isGrabbed) {
      cmpRigidbodyBall.setVelocity(fCore.Vector3.ZERO());
      cmpRigidbodyBall.setRotation(fCore.Vector3.ZERO());
      cmpRigidbodyBall.setPosition(childAvatarNode.mtxWorld.translation);
      ball.mtxWorld.translate(childAvatarNode.mtxWorld.translation);
    }
  }

  function createRigidbodies(): void {
    let level: fCore.Node = rootGraph.getChildrenByName("level")[0];
    for (let staticThing of level.getChildren()) {
      let cmpRigidbody: fCore.ComponentRigidbody = new fCore.ComponentRigidbody(0, fCore.PHYSICS_TYPE.STATIC, fCore.COLLIDER_TYPE.CUBE, fCore.PHYSICS_GROUP.DEFAULT);
      staticThing.addComponent(cmpRigidbody);
      if (staticThing.name != "floor" && staticThing.name != "wall")
        staticThing.addComponent(new StaticRotateCmp());
    }
    ball = rootGraph.getChildrenByName("ball")[0];
    cmpRigidbodyBall = new fCore.ComponentRigidbody(25, fCore.PHYSICS_TYPE.DYNAMIC, fCore.COLLIDER_TYPE.SPHERE, fCore.PHYSICS_GROUP.GROUP_2);
    ball.addComponent(cmpRigidbodyBall);
    ball.addComponent(new BallBouncerCmp());
    fCore.Physics.adjustTransforms(rootGraph, true);
  }

  function handleKeys(_deltaTime: number): void {
    if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.W, fCore.KEYBOARD_CODE.ARROW_UP]))
      forwardMovement = 1.33;
    else if (forwardMovement >= 0)
      forwardMovement -= _deltaTime * 2;

    if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.S, fCore.KEYBOARD_CODE.ARROW_DOWN]))
      backwardMovement = -1.33;
    else if (backwardMovement <= 0)
      backwardMovement += _deltaTime * 2;

    if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.SPACE]))
      if (isGrounded)
        cmpAvatar.applyLinearImpulse(fCore.Vector3.Y(playerJumpForce));

    if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.T]))
      fCore.Physics.settings.debugMode = fCore.Physics.settings.debugMode == fCore.PHYSICS_DEBUGMODE.JOINTS_AND_COLLIDER ? fCore.PHYSICS_DEBUGMODE.PHYSIC_OBJECTS_ONLY : fCore.PHYSICS_DEBUGMODE.JOINTS_AND_COLLIDER;
    if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.Y]))
      fCore.Physics.settings.debugDraw = !fCore.Physics.settings.debugDraw;
  }

  function player_Movement(_deltaTime: number): void {
    let playerForward: fCore.Vector3;
    playerForward = fCore.Vector3.Z();
    playerForward.transform(avatarNode.mtxWorld, false);

    let movementVelocity: fCore.Vector3 = new fCore.Vector3();
    movementVelocity.x = playerForward.x * (forwardMovement + backwardMovement) * movementspeed;
    movementVelocity.y = cmpAvatar.getVelocity().y;
    movementVelocity.z = playerForward.z * (forwardMovement + backwardMovement) * movementspeed;
    cmpAvatar.setVelocity(movementVelocity);
  }

  function onMouseMove(_event: MouseEvent): void {
    if (isPointerInGame) {
      avatarNode.mtxLocal.rotateY(-_event.movementX / 2);
      cmpAvatar.rotateBody(fCore.Vector3.Y(-_event.movementX / 2));
      avatarNode.getComponent(fCore.ComponentCamera).mtxPivot.rotateX(_event.movementY / 5);
    }
  }

  function isGrabbingObjects(): void {
    if (cmpRigidbodyBall != undefined) {
      if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.E])) {
        distance = fCore.Vector3.DIFFERENCE(ball.mtxWorld.translation, avatarNode.mtxWorld.translation);
        if (distance.magnitude > 4)
          return;
        cmpAudioGrab.play(true);
        cmpRigidbodyBall.setVelocity(fCore.Vector3.ZERO());
        cmpRigidbodyBall.setRotation(fCore.Vector3.ZERO());
        isGrabbed = true;
      }
      if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.R]) && isGrabbed == true) {
        cmpAudioShoot.play(true);
        isGrabbed = false;
        let playerForward: fCore.Vector3;
        playerForward = fCore.Vector3.Z();
        playerForward.transform(avatarNode.mtxWorld, false);
        cmpRigidbodyBall.applyImpulseAtPoint(
          new fCore.Vector3(playerForward.x * kickStrength, playerForward.y * 5 * kickStrength, playerForward.z * kickStrength),
          avatarNode.mtxWorld.translation);
      }
    }
  }

  function playerIsGroundedRaycast(): void {
    let hitInfo: fCore.RayHitInfo;
    hitInfo = fCore.Physics.raycast(cmpAvatar.getPosition(), new fCore.Vector3(0, -1, 0), 1.1);
    if (hitInfo.hit)
      isGrounded = true;
    else
      isGrounded = false;
  }

  function onPointerDown(_event: MouseEvent): void {
    if (!isPointerInGame) {
      canvas.requestPointerLock();
    }
  }

  function pointerLockChange(_event: Event): void {
    if (!document.pointerLockElement) {
      isPointerInGame = false;
    } else {
      isPointerInGame = true;
    }
  }
}
