"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const problemController_1 = require("../controllers/problemController");
const router = express_1.default.Router();
router.get('/', problemController_1.getAllProblems);
router.get('/:slug', problemController_1.getProblemBySlug);
router.post('/', problemController_1.createProblem);
exports.default = router;
//# sourceMappingURL=problems.js.map