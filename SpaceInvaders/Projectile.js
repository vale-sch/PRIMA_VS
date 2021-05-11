"use strict";
var SpaceInvaders;
(function (SpaceInvaders) {
    var fCore = FudgeCore;
    class Projectile extends SpaceInvaders.QuadNode {
        constructor() {
            super("shotNode", new fCore.Vector2(SpaceInvaders.mainPlayerShip.mtxWorld.translation.x, -0.6), new fCore.Vector2(0.025, 0.1));
            SpaceInvaders.projectilesNode.appendChild(this);
        }
        movingUpProjectile(_incrementFactor) {
            this.mtxLocal.translateY(_incrementFactor);
        }
    }
    SpaceInvaders.Projectile = Projectile;
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=Projectile.js.map