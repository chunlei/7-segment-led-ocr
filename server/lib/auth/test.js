/**
 * Created by ***REMOVED*** on 17/7/17.
 */
module.exports = async function(ctx, next) {
    if (!ctx.session.userName) {
        ctx.session.userName = 'xingming2';
        await next();
    }
};