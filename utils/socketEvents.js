// socketEvents.js
import {
    createGroup,
    joinGroup,
    leaveGroup,
    makeGroupadmin,
    getGroupMessage,
    postGroupMessage,
  } from '../controllers/groupController.js';
  
  export default function socketEvents(socket, io) {
    socket.on('create group', (data) => createGroup(data, io));
    socket.on('join group', (data) => joinGroup(data, io));
    socket.on('leave group', (data) => leaveGroup(data, io));
    socket.on('make group admin', (data) => makeGroupadmin(data, io));
    socket.on('get group message', (data) => getGroupMessage(data, io));
    socket.on('post group message', (data) => postGroupMessage(data, io));
  }
  