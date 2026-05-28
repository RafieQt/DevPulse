import { Router } from "express";

import auth from "../../middleware/auth";
import { issueController } from "./issue.controller";


const router = Router();


router.post('/', auth("maintainer", "contributor"), issueController.createIssue);
router.get('/', issueController.getAllIssues);
router.get('/:id', issueController.getSingleIssue);
router.patch('/:id', auth("maintainer", "contributor"), issueController.updateIssue);



export const issueRouter = router;