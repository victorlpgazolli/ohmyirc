let ircConnection = {}

function joinChannel({
  connection, channel
}) {

  try {
    const hasConn = !!connection?.join;

    const conn = hasConn
      ? connection
      : ircConnection;

    conn.join(channel.name)
  } catch {

  }
  finally {
    ircConnection = connection;
  }
}

function sendMessageToChannel({
  connection,
  channel,
  message
}) {
  try {
    const hasConn = !!connection?.join;

    const conn = hasConn
      ? connection
      : ircConnection;

    conn.say(channel, message);

  } catch (error) {
    alert("could not send message")
  }
}
function configConnection({
  connection
}) {
  try {
    ircConnection = connection;
  } catch (error) {
    alert("could not config conn")
  }
}

function terminateConnection({
  connection
}) {
  ircConnection = {};
  return connection?.disconnect?.()
}

export {
  ircConnection as connection,
  joinChannel,
  terminateConnection,
  configConnection,
  sendMessageToChannel,
}
