export const rooms=new Map()

export function createRoom(id,password=null){
    rooms.set(id,{password:password,canvasData:[]})
}

export function joinRoom(id ){
    return rooms.get(id)
}

export function exitRoom(id){
    return rooms.has(id)
}

