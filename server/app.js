const router = require('koa-router')();
const koaBody = require('koa-body');
const serve = require('koa-static');
const session = require('koa-session');
const sendFile = require('koa-sendfile');
const Koa = require('koa');

const moment = require('moment');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const mineType = require('mime-types');

const ***REMOVED***Auth = require('./lib/***REMOVED***Offline');
const testAuth = require('./lib/test');


const app = module.exports = new Koa();
app.keys = ['jsf6Ysjfkw8HksfU'];

// middleware

// custom 404
app.use(async function(ctx, next) {
    await next();
    if (ctx.body || !ctx.idempotent) return;
    ctx.redirect('/404.html');
});

app.use(session(app));
app.use(koaBody());

// for ***REMOVED***-internal-network auth
// app.use(***REMOVED***Auth);
// for test auth
app.use(testAuth);

// serve files from ./public
app.use(serve(path.join(__dirname, 'public')));

// route definitions
router
    .post('/token', token)
    .post('/tokenFeedback', tokenFeedback)
    .get('/userLog', getUserLog);
app.use(router.routes());




// 省事，就没搞独立的router文件了

/**
 * 查看用户日志
 * @param ctx
 * @returns {Promise.<void>}
 */
async function getUserLog(ctx, next) {
    const date = ctx.query.date;
    if (!date) {
        return await next();
    }

    const logFile = date.replace(/^\d{2}/, '') + '.csv';
    const logPath = path.join(__dirname, 'log/userLog/' + logFile);

    if (!fs.existsSync(logPath)) {
        ctx.body = `${date}的日志不存在，请输入 20170717 这样的格式`;
        return;
    }

    await sendFile(ctx, logPath);
}

/**
 * token
 */
async function token(ctx) {
    const ret = {error: null, data: null};

    const logKey = moment().format('YYMMDDHHmmss').replace(/\d$/, '0');
    const logPath = path.join(__dirname, 'log/' + logKey);
    const logExisted = fs.existsSync(logPath);

    try {
        if (logExisted) {
            ret.data = JSON.parse(fs.readFileSync(path.resolve(logPath, 'token.json')));
        }
        else {
            fs.mkdirSync(logPath);
            const token = {
                origin: fs.readFileSync(path.resolve(__dirname, '../token.png')),
                threshold: fs.readFileSync(path.resolve(__dirname, '../threshold.png')),
                text: fs.readFileSync(path.resolve(__dirname, '../token.txt'))
            };
            fs.writeFileSync(path.resolve(logPath, 'origin.png'), token.origin);
            fs.writeFileSync(path.resolve(logPath, 'threshold.png'), token.threshold);
            ret.data = {
                logKey,
                origin: img2base64(token.origin, 'origin.png'),
                threshold: img2base64(token.threshold, 'threshold.png'),
                text: token.text.toString()
            };
            fs.writeFileSync(path.resolve(logPath, 'token.json'), JSON.stringify(ret.data));
        }
    }
    catch (e) {
        ret.error = e;
    }

    !ret.error && userLog(ctx.session.userName);
    ctx.body = ret;
}

/**
 * token feedback
 */
async function tokenFeedback(ctx) {
    let ret = '<h2>反馈成功，感谢！<a href="/">点此返回</a></h2>';

    try {
        const {logKey, feedback} = ctx.request.body;
        const tokenJsonPath = path.resolve(__dirname, 'log/' + logKey + '/token.json');

        const tokenJson = JSON.parse(fs.readFileSync(tokenJsonPath));
        fs.writeFileSync(tokenJsonPath, JSON.stringify(_.merge({}, tokenJson, {feedback})));
    }
    catch (e) {
        ret = '<h2>反馈失败，请hi管理员~';
    }

    ctx.body = ret;
}


function img2base64(file, fileName) {
    const data = new Buffer(file).toString('base64');
    return 'data:' + mineType.lookup(fileName) + ';base64,' + data;
}

function userLog(userName) {
    let nextLog = [];
    const thisLog = [`${userName},${moment().format('YYYY-MM-DD HH:mm')}`];
    const logFile = moment().format('YYMMDD') + '.csv';
    const logPath = path.join(__dirname, 'log/userLog/' + logFile);

    try {
        if (fs.existsSync(logPath)) {
            const logList = nextLog = fs.readFileSync(logPath).toString().split('\n');
            const lastLog = _.last(logList).split(',');
            const [lastUserName, accessTime] = lastLog;
            // 如果同一个用户，请求间隔没超过180秒就不记录
            if (moment().unix() - moment(accessTime).unix() > 180 || lastUserName !== userName) {
                nextLog = nextLog.concat(thisLog);
            }
        }
    }
    catch (e) {}

    fs.writeFileSync(logPath, nextLog.join('\n'));
}


// listen
if (!module.parent) app.listen(3000);