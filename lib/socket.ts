import { Server } from 'socket.io'

let io: Server | null = null

export const setIO = (socketIO: Server) => {
  io = socketIO
}

export { io }
