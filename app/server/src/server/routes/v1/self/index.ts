import Router from '@koa/router'
import { jwtRequired } from '../../../middleware'
import { UserController, WellController } from '../../../controllers'

const self = new Router({ prefix: '/self' })

self.get('/user', jwtRequired, async ctx => UserController.getUserByToken(ctx))
self.patch('/user', jwtRequired, async ctx => UserController.updateUserByToken(ctx))
self.post('/well', jwtRequired, async ctx => WellController.createWellByToken(ctx))

export default self