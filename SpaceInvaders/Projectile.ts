namespace SpaceInvaders {
    import fCore = FudgeCore;
    export class Projectile extends QuadNode {
        constructor() {
            super("shotNode", new fCore.Vector2(mainPlayerShip.mtxLocal.translation.x, -0.6), new fCore.Vector2(0.025, 0.05));
            projectilesContainer.appendChild(this);
        }
        public movingUpProjectile(_increase: number): void {
            this.mtxLocal.translateY(_increase);
            this.setRectPosition();
        }
    }
}