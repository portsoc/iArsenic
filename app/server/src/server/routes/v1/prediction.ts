import Router from '@koa/router';
import { PredictionController } from '../../controllers';
import { useAuth } from '../../middleware'

const prediction = new Router();

prediction.post('/prediction', useAuth, ctx => PredictionController.createPrediction(ctx));
prediction.post('/prediction/well/:id', useAuth, ctx => PredictionController.createWellPrediction(ctx));
// TODO predictions query route actually just gets predictions for a list of wells
// this will need refactoring / updating, removing auth for now 
prediction.get('/prediction/query', ctx => PredictionController.getPredictionsByQuery(ctx));
prediction.get('/prediction/:id', useAuth, ctx => PredictionController.getPredictionById(ctx));
prediction.delete('/prediction/:id', useAuth, ctx => PredictionController.deletePrediction(ctx));
prediction.get('/self/prediction', useAuth, ctx => PredictionController.getUserPredictions(ctx));
prediction.get('/predictions', useAuth, ctx => PredictionController.getAllPredictions(ctx));

export default prediction;
