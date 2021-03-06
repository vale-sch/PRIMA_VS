"use strict";
var L05_PhysicsGame;
(function (L05_PhysicsGame) {
    var fudgeUI = FudgeUserInterface;
    class GameState extends FudgeCore.Mutable {
        constructor() {
            super(...arguments);
            this.hits = 0;
        }
        reduceMutator(_mutator) { }
    }
    L05_PhysicsGame.GameState = GameState;
    L05_PhysicsGame.gameState = new GameState();
    class Hud {
        static start() {
            let domHud = document.querySelector("div");
            Hud.controller = new fudgeUI.Controller(L05_PhysicsGame.gameState, domHud);
            Hud.controller.updateUserInterface();
        }
    }
    L05_PhysicsGame.Hud = Hud;
})(L05_PhysicsGame || (L05_PhysicsGame = {}));
//# sourceMappingURL=Hud.js.map