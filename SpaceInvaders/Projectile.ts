namespace SpaceInvaders {
    import fCore = FudgeCore;
    export class Projectile extends QuadNode {
        constructor() {
            super("shotNode", new fCore.Vector2(mainPlayerShip.mtxWorld.translation.x, -0.6), new fCore.Vector2(0.025, 0.1));
            projectilesNode.appendChild(this);
        }
        public movingUpProjectile(_incrementFactor: number): void {
            this.mtxLocal.translateY(_incrementFactor);
        }
    }
}