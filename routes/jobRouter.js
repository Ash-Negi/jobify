import {Router} from 'express'
const router = Router()

//controllers were seperated into seperate folder
import {
    getAllJobs,
    getJob,
    createJob,
    deleteJob,
    updateJob,
    showStats
    } from '../controllers/jobController.js'

import {
    validateJobInput,
    validateIdParam
    } from '../middleware/validationMiddleware.js'
import { checkForTestUser } from '../middleware/authMiddleware.js'

//router.get('/',getAllJobs)
//router.post('/',createJobs)

//unlike above, route allows us to chain.
//We can consolidate methods that have similar bases
router.route('/').get(getAllJobs).post(checkForTestUser ,validateJobInput, createJob)
router.route('/stats').get(showStats)
router.route('/:id').get(validateIdParam, getJob).patch(checkForTestUser, validateJobInput,validateIdParam, updateJob).delete(checkForTestUser,validateIdParam, deleteJob)

export default router;