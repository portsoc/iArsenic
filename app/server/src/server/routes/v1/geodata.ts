import Router from '@koa/router';
import { GeodataController } from '../../controllers';

const geodata = new Router({ prefix: '/geodata' });

geodata.get('/region-from-point', ctx => GeodataController.findRegion(ctx));

export default geodata;
