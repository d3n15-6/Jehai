import express from 'express'
import logger from 'morgan'

import { Server } from 'socket.io'
import { createServer } from 'node:http'
import path from 'node:path'

const port = process.env.port ?? 3000
const app = express()
const server = createServer(app)
const io = new Server(server)

app.use(express.static(path.join(process.cwd(), 'client')))
app.use('/bootstrap', express.static(path.join(process.cwd(), 'node_modules/bootstrap/dist')))

io.on('connection', (socket) => {
    console.log('a user has connected!')

    socket.on('disconnect', () => {
        console.log('an usar has disconnected')
    })

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg)
        io.emit('chat message', msg) // Enviar el mensaje a todos los clientes.  
    }) 
})

app.use(logger('dev'))

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd() + '/client/index.html'))
})

server.listen(port, () => {
    console.log('server running on port ${port}')
})