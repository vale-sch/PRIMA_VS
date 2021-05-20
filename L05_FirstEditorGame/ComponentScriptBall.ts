namespace L05_PhysicsGame {
    import fCore = FudgeCore;
    fCore.Project.registerScriptNamespace(L05_PhysicsGame);

    export class ComponentScriptBall extends fCore.ComponentScript {
        public name: string = "AudioControl";

        constructor() {
            super();
            console.log("ComponentScriptBall is alive!");

            this.addEventListener(fCore.EVENT.COMPONENT_ADD, this.hndComponentAdd);
        }

        private hndComponentAdd = (_event: CustomEvent): void => {
            if (_event.target == this)
                this.getContainer().addEventListener(fCore.EVENT.COMPONENT_ADD, this.hndComponentAdd);
            else {
                if (_event.detail instanceof fCore.ComponentRigidbody)
                    _event.detail.addEventListener(fCore.EVENT_PHYSICS.COLLISION_ENTER, this.hndCollision);
            }
        }
        private hndCollision = (_event: CustomEvent): void => {
            let cmpAudio: fCore.ComponentAudio = this.getContainer().getComponent(fCore.ComponentAudio);
            cmpAudio.play(true);
            gameState.hits++;
        }
    }
}