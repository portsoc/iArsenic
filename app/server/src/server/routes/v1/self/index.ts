import Router from '@koa/router'
import { jwtRequired, jwtOrGuest } from '../../../middleware'
import { UserController, WellController } from '../../../controllers'

const self = new Router({ prefix: '/self' })

self.get('/user', jwtRequired, async ctx => UserController.getUserByToken(ctx))
self.patch('/user', jwtRequired, async ctx => UserController.updateUserByToken(ctx))
self.delete('/user', jwtRequired, async ctx => UserController.deleteUserByToken(ctx))

self.get('/wells', jwtRequired, async ctx => WellController.getWellsByToken(ctx))
self.get('/well/:id', jwtOrGuest, async ctx => WellController.getWellByIdByToken(ctx))
self.post('/well', jwtOrGuest, async ctx => WellController.createWellByToken(ctx))
self.patch('/well/:id', jwtOrGuest, async ctx => WellController.updateWellByIdByToken(ctx))
self.delete('/well/:id', jwtRequired, async ctx => WellController.deleteWellByIdByToken(ctx))

export default self