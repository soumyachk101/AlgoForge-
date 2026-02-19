import express from 'express';
import { getAllProblems, getProblemBySlug, createProblem } from '../controllers/problemController';

const router = express.Router();

// Get all problems
router.get('/', getAllProblems);

// Get a single problem by slug
router.get('/:slug', getProblemBySlug);

// Create a problem (Seed/Admin)
router.post('/', createProblem);

export default router;
