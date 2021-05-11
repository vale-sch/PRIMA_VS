namespace SpaceInvaders {
    import fCore = FudgeCore;
    export class LastEnemy extends QuadNode {

        constructor() {
            super("LastEnemy", new fCore.Vector2(0, 0.8), new fCore.Vector2(0.15, 0.15));
        }
    }
}