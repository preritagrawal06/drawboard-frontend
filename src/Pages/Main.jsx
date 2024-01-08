import { useState, useEffect } from "react"
import {io} from "socket.io-client"
import { useLocation } from "react-router-dom"

const Main = () => {
    
    const location = useLocation()
    const [xcood, setXcood] = useState(0)
    const [ycood, setYcood] = useState(0)
    const [count, setCount] = useState(0)
    const [socket, setSocket] = useState(null)
    const [name, setName] = useState('')


    useEffect(()=>{
        const socketInstance = io("http://localhost:5000")
        setSocket(socketInstance)
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
            // console.log(room);
        })

        socket.on("mouse-location", (data)=>{
            // console.log(data)
            setXcood(data.x)
            setYcood(data.y)
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
            hello
            {
                count > 1
                ?
                <div style={style}>
                    {name}
                </div>
                :
                <div>{count} connection yet</div>

            }
        </div>
     );
}
 
export default Main;