"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bird = void 0;
var typeorm_1 = require("typeorm");
var Bird = /** @class */ (function () {
    function Bird() {
        var _this = this;
        this.sayHello = function () {
            console.log("Hello, I am " + _this.name);
        };
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
        __metadata("design:type", String)
    ], Bird.prototype, "uuid", void 0);
    __decorate([
        (0, typeorm_1.Column)({ unique: true }),
        __metadata("design:type", String)
    ], Bird.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 100 }),
        __metadata("design:type", String)
    ], Bird.prototype, "name", void 0);
    __decorate([
        (0, typeorm_1.Column)("text"),
        __metadata("design:type", String)
    ], Bird.prototype, "short", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Bird.prototype, "image", void 0);
    __decorate([
        (0, typeorm_1.Column)("simple-array"),
        __metadata("design:type", Array)
    ], Bird.prototype, "recon", void 0);
    __decorate([
        (0, typeorm_1.Column)("simple-json"),
        __metadata("design:type", Object)
    ], Bird.prototype, "food", void 0);
    __decorate([
        (0, typeorm_1.Column)("text"),
        __metadata("design:type", String)
    ], Bird.prototype, "see", void 0);
    Bird = __decorate([
        (0, typeorm_1.Entity)("birds")
    ], Bird);
    return Bird;
}());
exports.Bird = Bird;
