"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProblem = exports.getProblemBySlug = exports.getAllProblems = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getAllProblems = async (_req, res) => {
    try {
        const problems = await prisma_1.default.problem.findMany({
            select: {
                id: true,
                title: true,
                slug: true,
                difficulty: true,
                acceptance: true,
            },
        });
        return res.json(problems);
    }
    catch (error) {
        return res.status(500).json({ error: 'Error fetching problems' });
    }
};
exports.getAllProblems = getAllProblems;
const getProblemBySlug = async (req, res) => {
    const { slug } = req.params;
    if (!slug) {
        return res.status(400).json({ error: 'Slug is required' });
    }
    try {
        const problem = await prisma_1.default.problem.findUnique({
            where: { slug: String(slug) },
        });
        if (!problem) {
            return res.status(404).json({ error: 'Problem not found' });
        }
        return res.json(problem);
    }
    catch (error) {
        return res.status(500).json({ error: 'Error fetching problem' });
    }
};
exports.getProblemBySlug = getProblemBySlug;
const createProblem = async (req, res) => {
    const { title, slug, difficulty, description, starterCode, testCases } = req.body;
    try {
        const problem = await prisma_1.default.problem.create({
            data: {
                title,
                slug,
                difficulty,
                description,
                starterCode,
                testCases: JSON.stringify(testCases)
            }
        });
        return res.json(problem);
    }
    catch (error) {
        return res.status(500).json({ error: 'Error creating problem' });
    }
};
exports.createProblem = createProblem;
//# sourceMappingURL=problemController.js.map