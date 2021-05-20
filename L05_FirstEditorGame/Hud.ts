namespace L05_PhysicsGame {
    import fudgeUI = FudgeUserInterface;

    export class GameState extends FudgeCore.Mutable {
        public hits: number = 0;
        protected reduceMutator(_mutator: FudgeCore.Mutator): void { }
    }
    export let gameState: GameState = new GameState();

    export class Hud {
        private static controller: fudgeUI.Controller;
        public static start(): void {
            let domHud: HTMLDivElement = document.querySelector("div");
            Hud.controller = new fudgeUI.Controller(gameState, domHud);
            Hud.controller.updateUserInterface();
        }
    }
}