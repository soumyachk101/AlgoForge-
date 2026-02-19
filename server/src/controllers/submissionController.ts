import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const createSubmission = async (req: Request, res: Response) => {
    const { userId, problemId, code, language: _language } = req.body;

    try {
        // Mock Execution Logic
        // In a real app, this would send code to a judge server/Docker container
        const statuses = ["Accepted", "Wrong Answer", "Runtime Error", "Time Limit Exceeded"];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

        const submission = await prisma.submission.create({
            data: {
                userId,
                problemId,
                code,
                status: randomStatus,
            },
        });

        return res.json(submission);
    } catch (error) {
        return res.status(500).json({ error: 'Error submitting solution' });
    }
};

export const getSubmissions = async (req: Request, res: Response) => {
    const { problemId } = req.params;
    const userIdInput = req.query.userId;

    if (!userIdInput || typeof userIdInput !== 'string') {
        return res.status(400).json({ error: 'User ID required and must be a string' });
    }

    const userId = userIdInput as string;

    try {
        const submissions = await prisma.submission.findMany({
            where: {
                problemId: String(problemId),
                userId
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return res.json(submissions);
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching submissions' });
    }
};
