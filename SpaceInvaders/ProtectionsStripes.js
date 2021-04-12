"use strict";
var SpaceInvaders;
(function (SpaceInvaders) {
    var fCore = FudgeCore;
    class ProtectionsStripes extends SpaceInvaders.QuadNode {
        constructor(_name, _pos) {
            super("ProtectionStripe", new fCore.Vector2(_pos.x, _pos.y), new fCore.Vector2(0.05, 0.05));
        }
    }
    SpaceInvaders.ProtectionsStripes = ProtectionsStripes;
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=ProtectionsStripes.js.map