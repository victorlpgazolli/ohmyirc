import { Client } from 'irc'
import { configConnection } from '../RedisConnection';

export function loadConnection({
  host,
  port,
  username,
  timeout = 25000,
}) {
  return new Promise((resolve, reject) => {
    try {
      const stop = setTimeout(() => {
        reject()
      }, timeout)
  
      const connection = new Client(host, username, {
        port: Number(port),
        nick: username,
        userName: username,
        realName: username,
      })
      connection.once('registered', function () {
        clearTimeout(stop)    
        setTimeout(() => {
          const channelsNames = Object.keys(connection.chans)
          const channels = channelsNames.map(channelName => {
              const channelInfo = connection.chans[channelName];
              const users = Object.keys(channelInfo.users)
              return {
                users: users,
                name: channelName,
              }
          })
          configConnection({ connection })
          resolve({
            channels,
            connection
          })
        }, 2000)
      });
    } catch (error) {

      reject()
    }
  });
}
