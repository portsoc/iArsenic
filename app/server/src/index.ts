import './server/bootstrap'
import config from './server/config'
import cors from '@koa/cors'
import helmet from 'koa-helmet'
import Koa from 'koa'
import routes from './server/routes'
import uuid4 from 'uuid4'
import fs from 'fs';
import path from 'path';
import * as functions from 'firebase-functions';
import hybridBodyParser from './server/middleware/hybridBodyParser'

const isServerless = !!process.env.GCLOUD_PROJECT;

const api = new Koa();
const staticDir = path.resolve(__dirname, 'static');

api.use(async (ctx, next) => {
    const reqId = ctx.request.get('x-request-id') || uuid4()
    ctx.set('x-request-id', reqId)
    console.log(
        `${ctx.request.method} ${ctx.request.url} ${reqId}`
    )
    await next()
})

// middleware
api.use(cors())
api.use(helmet())
api.use(hybridBodyParser())

// mount the routes
api.use(routes.routes())

// Serve static files or fall back to index.html
api.use(async ctx => {
    const requestedPath = path.join(staticDir, ctx.path);

    if (fs.existsSync(requestedPath) && fs.lstatSync(requestedPath).isFile()) {
        ctx.type = path.extname(requestedPath);
        ctx.body = fs.createReadStream(requestedPath);
    } else {
        ctx.type = 'html';
        ctx.body = fs.createReadStream(path.join(staticDir, 'index.html'));
    }
});

// start the server
if (!isServerless) {
    api.listen(config.port)
    console.log(`server listening on port ${config.port}`)
}

export default functions.runWith({ memory: '512MB' }).https.onRequest(api.callback());