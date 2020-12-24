import { connections } from '../../store/connections'

export function saveMessageToConnection(
    host,
    newMessage,
) {
    const currentConnections = connections.get('connections')

    const foundIndex = currentConnections.findIndex(
        findConnection => findConnection.host === host
    )

    if (foundIndex > -1) {
        const removeDuplicates = (total, current) => {
            total[current.from + current.time + current.message] = current;
            return total;
        };

        currentConnections[foundIndex].messages = Object.values([
            ...currentConnections[foundIndex].messages,
            newMessage,
        ].reduce(removeDuplicates, {}));

        connections.set('connections', currentConnections);

        return currentConnections[foundIndex].messages
    }


    return []
}
