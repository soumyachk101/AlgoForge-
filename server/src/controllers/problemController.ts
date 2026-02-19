import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getAllProblems = async (_req: Request, res: Response) => {
    try {
        const problems = await prisma.problem.findMany({
            select: {
                id: true,
                title: true,
                slug: true,
                difficulty: true,
                acceptance: true,
            },
        });
        return res.json(problems);
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching problems' });
    }
};

export const getProblemBySlug = async (req: Request, res: Response) => {
    const { slug } = req.params;

    if (!slug) {
        return res.status(400).json({ error: 'Slug is required' });
    }

    try {
        const problem = await prisma.problem.findUnique({
            where: { slug: String(slug) },
        });
        if (!problem) {
            return res.status(404).json({ error: 'Problem not found' });
        }
        return res.json(problem);
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching problem' });
    }
};

export const createProblem = async (req: Request, res: Response) => {
    const { title, slug, difficulty, description, starterCode, testCases } = req.body;
    try {
        const problem = await prisma.problem.create({
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
    } catch (error) {
        return res.status(500).json({ error: 'Error creating problem' });
    }
};
