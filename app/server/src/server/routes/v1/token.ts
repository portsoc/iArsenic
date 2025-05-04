import Router from '@koa/router';
import { adminOnly } from '../../middleware'
import { TokenController } from '../../controllers';

const token = new Router();

token.post('/token/api-key', adminOnly, ctx => TokenController.createApiKey(ctx));

export default token;
