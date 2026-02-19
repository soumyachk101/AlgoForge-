"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubmissions = exports.createSubmission = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const createSubmission = async (req, res) => {
    const { userId, problemId, code, language: _language } = req.body;
    try {
        const statuses = ["Accepted", "Wrong Answer", "Runtime Error", "Time Limit Exceeded"];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        const submission = await prisma_1.default.submission.create({
            data: {
                userId,
                problemId,
                code,
                status: randomStatus,
            },
        });
        return res.json(submission);
    }
    catch (error) {
        return res.status(500).json({ error: 'Error submitting solution' });
    }
};
exports.createSubmission = createSubmission;
const getSubmissions = async (req, res) => {
    const { problemId } = req.params;
    const userIdInput = req.query.userId;
    if (!userIdInput || typeof userIdInput !== 'string') {
        return res.status(400).json({ error: 'User ID required and must be a string' });
    }
    const userId = userIdInput;
    try {
        const submissions = await prisma_1.default.submission.findMany({
            where: {
                problemId: String(problemId),
                userId
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return res.json(submissions);
    }
    catch (error) {
        return res.status(500).json({ error: 'Error fetching submissions' });
    }
};
exports.getSubmissions = getSubmissions;
//# sourceMappingURL=submissionController.js.map