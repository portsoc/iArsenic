import Router from '@koa/router';
import { TokenController } from '../../controllers';
import { useAuth } from '../../middleware'

const token = new Router();

token.post('/token/api-key', useAuth, ctx => TokenController.createApiKey(ctx));

export default token;
