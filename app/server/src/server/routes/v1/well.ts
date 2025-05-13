import Router from '@koa/router'
import { WellController } from '../../controllers';
import { useAuth } from '../../middleware'

const well = new Router({ prefix: '/well' })

well.get('s', useAuth, ctx => WellController.getAllWells(ctx));
well.post('/:id/prediction', useAuth, ctx => WellController.generatePrediction(ctx));

export default well