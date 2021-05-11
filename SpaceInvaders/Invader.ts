namespace SpaceInvaders {
    import fCore = FudgeCore;
    export class Invader extends QuadNode {
        constructor(_x: number, _y: number) {
            super("Invader", new fCore.Vector2(_x, _y), new fCore.Vector2(0.1, 0.1));

            this.mtxLocal.translateY(0.825);
            this.mtxLocal.translateX(-1.7);
        }
    }
}

