
import { connections } from '../../store/connections'

export function createAndGetConnections(
  connection
){
  const currentConnections = connections.get('connections')
  const exists = currentConnections.find(
    findConnection => findConnection.host === connection.host
    )
    
    if (exists) {
      throw new Error('Connection name already exists.')
    }
    
    const updatedConnections = [...currentConnections, connection]
    
    connections.set('connections', updatedConnections)
  

  return updatedConnections
}
