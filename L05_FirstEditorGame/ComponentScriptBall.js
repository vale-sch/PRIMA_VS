"use strict";
var L05_PhysicsGame;
(function (L05_PhysicsGame) {
    var fCore = FudgeCore;
    fCore.Project.registerScriptNamespace(L05_PhysicsGame);
    class ComponentScriptBall extends fCore.ComponentScript {
        constructor() {
            super();
            this.name = "AudioControl";
            this.hndComponentAdd = (_event) => {
                if (_event.target == this)
                    this.getContainer().addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndComponentAdd);
                else {
                    if (_event.detail instanceof fCore.ComponentRigidbody)
                        _event.detail.addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, this.hndCollision);
                }
            };
            this.hndCollision = (_event) => {
                let cmpAudio = this.getContainer().getComponent(fCore.ComponentAudio);
                cmpAudio.play(true);
            };
            console.log("ComponentScriptBall is alive!");
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndComponentAdd);
        }
    }
    L05_PhysicsGame.ComponentScriptBall = ComponentScriptBall;
})(L05_PhysicsGame || (L05_PhysicsGame = {}));
//# sourceMappingURL=ComponentScriptBall.js.map