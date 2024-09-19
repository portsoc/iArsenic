import Router from '@koa/router'
import { adminOnly } from '../../middleware'
import { WellController } from '../../controllers';

const well = new Router({ prefix: '/well' })

well.get('s', adminOnly, ctx => WellController.getAllWells(ctx));

export default well