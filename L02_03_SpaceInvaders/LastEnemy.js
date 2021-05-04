"use strict";
var SpaceInvaders;
(function (SpaceInvaders) {
    var fCore = FudgeCore;
    class LastEnemy extends SpaceInvaders.QuadNode {
        constructor() {
            super("LastEnemy", new fCore.Vector2(0, 0.8), new fCore.Vector2(0.15, 0.15));
        }
    }
    SpaceInvaders.LastEnemy = LastEnemy;
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=LastEnemy.js.map