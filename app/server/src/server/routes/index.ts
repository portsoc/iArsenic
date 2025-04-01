import Router from '@koa/router';
import v1 from './v1';

const routes = new Router();

// Mount the sub-routes
routes.use(v1.routes());

export default routes;
