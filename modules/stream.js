/**
 * Logs error, destroys the stream, exits program
 *
 * @param { Error } error The error thrown
 * @param { (WriteStream | ReadStream) } stream The stream to destory
 */
function onError(error, stream) {
    console.error(error);
    stream.destroy();
    process.exit(1);
}

module.exports = { onError };
