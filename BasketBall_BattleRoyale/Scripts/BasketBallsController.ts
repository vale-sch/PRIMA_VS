namespace basketBallBattleRoyale {
    import fCore = FudgeCore;


    fCore.Project.registerScriptNamespace(basketBallBattleRoyale);
    export class BasketBallsController extends fCore.ComponentScript {
        public isInUse: boolean = false;
        constructor() {
            super();
        }
    }
}