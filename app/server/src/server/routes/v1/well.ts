import Router from '@koa/router'
import { adminOnly } from '../../middleware'
import { WellController } from 'src/server/controllers';

const well = new Router({ prefix: '/well' })

well.get('/', adminOnly, ctx => WellController.getAllWells(ctx));

export default well