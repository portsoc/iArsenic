import Router from '@koa/router'
import { useAuth } from '../../../middleware'
import { UserController, WellController } from '../../../controllers'

const self = new Router({ prefix: '/self' })

self.get('/user', useAuth, async ctx => UserController.getUserByToken(ctx))
self.patch('/user', useAuth, async ctx => UserController.updateUserByToken(ctx))
self.delete('/user', useAuth, async ctx => UserController.deleteUserByToken(ctx))

self.get('/wells', useAuth, async ctx => WellController.getWellsByToken(ctx))
self.post('/well', useAuth, async ctx => WellController.createWell(ctx))
self.get('/wells/query', useAuth, ctx => WellController.getSelfWellsByQuery(ctx));
self.post('/wells/claim', useAuth, async ctx => WellController.claimWells(ctx))
self.delete('/well/:id/image', useAuth, async ctx => WellController.deleteWellImage(ctx))
self.post('/well/:id/upload-url', useAuth, async ctx => WellController.getImageUploadSignedUrl(ctx))
self.post('/well/:id/confirm-upload', useAuth, async ctx => WellController.confirmWellImageUpload(ctx))
self.post('/well/:id/signed-image-urls', useAuth, async ctx => WellController.getWellImageUrls(ctx))
self.get('/well/:id', useAuth, async ctx => WellController.getWellById(ctx))
self.patch('/well/:id', useAuth, async ctx => WellController.updateWellByIdByToken(ctx))
self.delete('/well/:id', useAuth, async ctx => WellController.deleteWellByIdByToken(ctx))

export default self