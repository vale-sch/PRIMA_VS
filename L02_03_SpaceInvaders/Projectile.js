"use strict";
var SpaceInvaders;
(function (SpaceInvaders) {
    var fCore = FudgeCore;
    class Projectile extends SpaceInvaders.QuadNode {
        constructor() {
            super("shotNode", new fCore.Vector2(SpaceInvaders.mainPlayerShip.mtxLocal.translation.x, -0.6), new fCore.Vector2(0.025, 0.05));
            SpaceInvaders.projectilesContainer.appendChild(this);
        }
        movingUpProjectile(_increase) {
            this.mtxLocal.translateY(_increase);
            this.setRectPosition();
        }
    }
    SpaceInvaders.Projectile = Projectile;
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=Projectile.js.map