import { atom } from 'recoil'

import { connections } from '../store/connections'


export const connectionsState = atom({
  key: 'connections',
  default: connections.get('connections')
})

export const currentConnectionState = atom({
  key: 'currentConnection',
  default: undefined
})


export const messagesPerChannelState = atom({
  key: 'messagesPerChannel',
  default: undefined
})

export const channelsState = atom({
  key: 'channels',
  default: undefined
})

export const currentChannelState = atom({
  key: 'currentChannel',
  default: undefined
})

