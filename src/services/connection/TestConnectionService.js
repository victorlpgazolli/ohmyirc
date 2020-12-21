import { Client } from 'irc'

export async function testConnection({
  host,
  port,
  username
}) {
  return new Promise((resolve, reject) => {
    try {
      const connection = new Client(host, username, {
        port: Number(port),
        nick: username,
        userName: username,
        realName: username,
      })

      setTimeout(() => {

        connection.disconnect()

        resolve();
      }, 3000)
    } catch (error) {

      reject();
    }
  });
}
