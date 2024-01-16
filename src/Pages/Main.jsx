import { useState, useEffect } from "react"
import {io} from "socket.io-client"
import { useLocation } from "react-router-dom"

const Main = () => {
    
    const location = useLocation()
    const [xcood, setXcood] = useState(0)
    const [ycood, setYcood] = useState(0)
    const [room, setRoom] = useState(null)
    const [socket, setSocket] = useState(null)
    const [name, setName] = useState('')
    const [code, setCode] = useState('')


    useEffect(()=>{
        const socketInstance = io("http://localhost:5000")
        setSocket(socketInstance)
        setName(location.state.username)
        setCode(location.state.code)
        socketInstance.on("connect", ()=>{
            socketInstance.emit("user:new", {code: location.state.code})
        })
        
        return ()=>{
            socketInstance.disconnect()
        }
    },[])
    
    if(socket){
        // console.log(socket.id === socketInstance.id)

        socket.on("user:join", (room)=>{
            setRoom(room)
        })

        socket.on("mouse-location", (data)=>{
            // console.log(data)
            setXcood(data.x)
            setYcood(data.y)
        })

        socket.on("user:left", (data)=>{
            console.log(data);
        })
    }

    const handleMouseEvent = (e)=>{
        const x = e.clientX
        const y = e.clientY
        // socket.emit("mouse-move", {x, y})
    }
    

    const style = {
        "position": "absolute",
        "border" : "1px solid red",
        "padding" : "0.5rem",
        "color": "black",
        "left" : `${xcood}px`,
        "top" : `${ycood}px`
    }

    return ( 
        <div className="main-container" onMouseMove={handleMouseEvent}>
            hello {name}
            {
                // room.count > 1
                // ?
                // <div style={style}>
                //     {name}
                // </div>
                // :
                <div>{room ? room.count : "0"} connection yet</div>

            }
        </div>
     );
}
 
export default Main;