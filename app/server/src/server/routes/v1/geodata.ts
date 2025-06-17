import Router from '@koa/router';
import { GeodataController } from '../../controllers';
import { useAuth } from '../../middleware'

const geodata = new Router({ prefix: '/geodata' });

geodata.get('/region-from-point', useAuth, ctx => GeodataController.findRegion(ctx));

export default geodata;
