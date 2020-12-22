
export function loadConfigFromConnection() {


    if (!window.ircConnection) {
        throw new Error('IRC connection not established when loading config')
    }

    const {
        motd,
        hostMask,
        opt,
    } = window.ircConnection || {};

    const {
        server,
        nick,
        password,
        userName,
        realName,
        port,
        localAddress,
        debug,
        showErrors,
        autoRejoin,
        autoConnect,
        channels,
        retryCount,
        retryDelay,
        secure,
        sasl
    } = opt || {};

    return {
        motd,
        hostMask,
        server,
        nick,
        password,
        userName,
        realName,
        port,
        localAddress,
        debug,
        showErrors,
        autoRejoin,
        autoConnect,
        channels,
        retryCount,
        retryDelay,
        secure,
        sasl
    }
}
