import express from 'express';
import { createSubmission, getSubmissions } from '../controllers/submissionController';

const router = express.Router();

// Create a submission (Mock execution)
router.post('/', createSubmission);

// Get submissions for a problem (specific to user)
router.get('/:problemId', getSubmissions);

export default router;
