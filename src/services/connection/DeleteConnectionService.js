import { connections } from '../../store/connections'

export function deleteAndGetConnections(
  connection
) {
  const currentConnections = connections.get('connections')

  const foundIndex = currentConnections.findIndex(
    findConnection => findConnection.host === connection.host
  )

  if (foundIndex > -1) {
    currentConnections.splice(foundIndex, 1)
  }

  connections.set('connections', currentConnections)

  return currentConnections
}
