"use strict";
var SpaceInvaders;
(function (SpaceInvaders) {
    var fCore = FudgeCore;
    class Invader extends SpaceInvaders.QuadNode {
        constructor(_x, _y) {
            super("Invader", new fCore.Vector2(_x, _y), new fCore.Vector2(0.1, 0.1));
        }
    }
    SpaceInvaders.Invader = Invader;
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=Invader.js.map