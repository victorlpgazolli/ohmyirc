
export function loadUsersFromChannel({
  channel
}){
  if (!window.ircConnection) {
    throw new Error('IRC connection not established')
  }
  const {
    name: channelName
  } = channel;

  const channelInfo = window.ircConnection?.chans?.[channelName] || { users: [] }

  const users = Object.keys(channelInfo.users)

  return users
}
