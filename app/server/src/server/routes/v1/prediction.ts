import Router from '@koa/router';
import { PredictionController } from '../../controllers';
import { adminOnly, jwtOrGuest } from '../../middleware'

const prediction = new Router();

prediction.post('/prediction', adminOnly, ctx => PredictionController.createPrediction(ctx));
prediction.post('/prediction/well/:id', jwtOrGuest, ctx => PredictionController.createWellPrediction(ctx));
prediction.get('/prediction/query', jwtOrGuest, ctx => PredictionController.getPredictionsByQuery(ctx));
prediction.get('/prediction/:id', ctx => PredictionController.getPredictionById(ctx));
prediction.delete('/prediction/:id', ctx => PredictionController.deletePrediction(ctx));
prediction.get('/prediction', ctx => PredictionController.getPredictionsByToken(ctx));
prediction.get('/predictions', adminOnly, ctx => PredictionController.getAllPredictions(ctx));

export default prediction;
