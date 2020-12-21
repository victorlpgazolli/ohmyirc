import { connection } from '../RedisConnection'

export function loadUsersFromChannel({
  channel
}){
  if (!connection) {
    throw new Error('IRC connection not established')
  }
  const {
    name: channelName
  } = channel;

  const channelInfo = connection?.chans?.[channelName] || { users: [] }

  const users = Object.keys(channelInfo.users)

  return users
}
