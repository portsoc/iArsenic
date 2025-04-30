import Router from '@koa/router';
import { adminOnly } from '../../middleware'
import { TokenController } from 'src/server/controllers';

const token = new Router();

token.post('/token/api-key', adminOnly, ctx => TokenController.createApiKey(ctx));

export default token;
