import Router from '@koa/router';
import { PredictionController } from '../../controllers';
import { adminOnly, jwtOrGuest } from '../../middleware'

const prediction = new Router({ prefix: '/prediction' });

prediction.post('/', ctx => PredictionController.createPrediction(ctx));
prediction.post('/well/:id', jwtOrGuest, ctx => PredictionController.createWellPrediction(ctx));
prediction.get('/query', jwtOrGuest, ctx => PredictionController.getPredictionsByQuery(ctx));
prediction.get('/:id', ctx => PredictionController.getPredictionById(ctx));
prediction.delete('/:id', ctx => PredictionController.deletePrediction(ctx));
prediction.get('/', ctx => PredictionController.getPredictionsByToken(ctx));
prediction.get('s', adminOnly, ctx => PredictionController.getAllPredictions(ctx));

export default prediction;
