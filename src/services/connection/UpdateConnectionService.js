import { connections } from '../../store/connections'

export function updateAndGetConnections(
  oldConnection,
  newConnection
) {
  const currentConnections = connections.get('connections')

  const foundIndex = currentConnections.findIndex(
    findConnection => findConnection.name === oldConnection.name
  )

  if (foundIndex > -1) {
    currentConnections[foundIndex] = newConnection
  }

  connections.set('connections', currentConnections)

  return currentConnections
}
