import io from 'socket.io-client'
import {ENVIRONMENT} from '../env'

export const socket = io(ENVIRONMENT.DATA_SERVER_URL)
