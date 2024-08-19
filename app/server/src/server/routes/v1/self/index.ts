import Router from '@koa/router'
import { jwtRequired } from '../../../middleware'
import { UserController, WellController } from '../../../controllers'

const self = new Router({ prefix: '/self' })

self.get('/user', jwtRequired, async ctx => UserController.getUserByToken(ctx))
self.patch('/user', jwtRequired, async ctx => UserController.updateUserByToken(ctx))
self.delete('/user', jwtRequired, async ctx => UserController.deleteUserByToken(ctx))

self.get('/wells', jwtRequired, async ctx => WellController.getWellsByToken(ctx))
self.get('/well/:id', jwtRequired, async ctx => WellController.getWellByIdByToken(ctx))
self.post('/well', jwtRequired, async ctx => WellController.createWellByToken(ctx))
self.patch('/well/:id', jwtRequired, async ctx => WellController.updateWellByIdByToken(ctx))
self.delete('/well/:id', jwtRequired, async ctx => WellController.deleteWellByIdByToken(ctx))

self.post('/well/:id/predict', jwtRequired, async ctx => WellController.predictWellByIdByToken(ctx))

export default self