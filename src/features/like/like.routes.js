
import express from 'express';
import { LikeController } from './like.controller.js';

const likeController = new LikeController();
const likesRouter = express.Router();

likesRouter.post('/', (req, res, next)=> {
likeController.likeItem(req, res, next)
});
likesRouter.get('/', (req, res, next)=> {
likeController.getLikes(req, res, next)
});

export default likesRouter;

