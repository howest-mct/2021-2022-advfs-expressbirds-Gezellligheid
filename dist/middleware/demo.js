"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.middelwareDemo = void 0;
var express_1 = require("express");
var middelwareDemo = function (next, req, res) {
    express_1.response.set("Grapje", ":_)");
    next();
};
exports.middelwareDemo = middelwareDemo;
