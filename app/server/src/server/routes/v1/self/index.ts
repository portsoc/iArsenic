import Router from '@koa/router'
import { jwtRequired, jwtOrGuest } from '../../../middleware'
import { UserController, WellController } from '../../../controllers'

const self = new Router({ prefix: '/self' })

self.get('/user', jwtRequired, async ctx => UserController.getUserByToken(ctx))
self.patch('/user', jwtRequired, async ctx => UserController.updateUserByToken(ctx))
self.delete('/user', jwtRequired, async ctx => UserController.deleteUserByToken(ctx))

self.get('/wells', jwtRequired, async ctx => WellController.getWellsByToken(ctx))
self.post('/well', jwtOrGuest, async ctx => WellController.createWellByToken(ctx))
self.get('/wells/query', jwtOrGuest, ctx => WellController.getSelfWellsByQuery(ctx));
self.post('/wells/claim', jwtRequired, async ctx => WellController.claimWells(ctx))
self.delete('/well/:id/image', jwtOrGuest, async ctx => WellController.deleteWellImage(ctx))
self.post('/well/:id/upload-url', jwtOrGuest, async ctx => WellController.getImageUploadSignedUrl(ctx))
self.post('/well/:id/confirm-upload', jwtOrGuest, async ctx => WellController.confirmWellImageUpload(ctx))
self.post('/well/:id/signed-image-urls', jwtOrGuest, async ctx => WellController.getWellImageUrls(ctx))
self.get('/well/:id', jwtOrGuest, async ctx => WellController.getWellByIdByToken(ctx))
self.patch('/well/:id', jwtOrGuest, async ctx => WellController.updateWellByIdByToken(ctx))
self.delete('/well/:id', jwtRequired, async ctx => WellController.deleteWellByIdByToken(ctx))

export default self