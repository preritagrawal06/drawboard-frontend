import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";
import RoomDetail from "../Components/RoomDetail";
import { Box } from "@mui/material";


const Main = () => {
  const location = useLocation();
  const canvasRef = useRef(null)
  const [ctx, setCtx] = useState(null)
  const [xcood, setXcood] = useState(0);
  const [ycood, setYcood] = useState(0);
  const [room, setRoom] = useState(null);
  const [socket, setSocket] = useState(null);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [mouseDown, setMouseDown] = useState(false)


  useEffect(()=>{
    
        const canvas = canvasRef.current
        canvas.width = document.getElementById('canvas-container').offsetWidth
        canvas.height = document.getElementById('canvas-container').offsetHeight
        setCtx(canvas.getContext('2d'))

  },[])

  useEffect(() => {
    const socketInstance = io("http://localhost:5000");
    setSocket(socketInstance);
    setName(location.state.username);
    setCode(location.state.code);
    socketInstance.on("connect", () => {
      socketInstance.emit("user:new", { code: location.state.code, username: location.state.username });
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  if (socket) {
    // console.log(socket.id === socketInstance.id)

    socket.on("user:join", (room) => {
      setRoom(room);
    });

    socket.on("mouse:location", (data) => {
      // console.log(data)
      setXcood(data.x);
      setYcood(data.y);
    });

    socket.on("user:left", (data) => {
      setRoom(data.room);
    });

    socket.on("mouse:ondraw", (data)=>{
      ctx.lineTo(data.x, data.y)
      ctx.stroke()
    })

    socket.on("mouse:onDown", (data)=>{
      ctx.moveTo(data.x, data.y)
    })
  }

  const handleMouseEvent = (e) => {
    const x = e.clientX;
    const y = e.clientY;
    if(mouseDown){
      socket.emit('mouse:draw', {code, x, y})
      ctx.lineTo(x, y);
      ctx.stroke()
    }
    if(socket) socket.emit("mouse:move", {code, x, y})
  };

  const handleMouseDown = (e)=>{
    ctx.moveTo(e.clientX, e.clientY)
    socket.emit("mouse:down", {code, x: e.clientX, y: e.clientY})
    setMouseDown(true)
  }

  const handleMouseUp = (e)=>{
    setMouseDown(false)
  }

  const style = {
    position: "absolute",
    border: "1px solid red",
    padding: "0.5rem",
    color: "black",
    left: `${xcood}px`,
    top: `${ycood}px`,
  };

  return (
    <Box
      width="100%"
      minHeight="100svh"
      bgcolor="white"
      display="flex"
      gap="2rem"
      justifyContent="center"
      >
        <Box
            width="80%"
            height="90vh"
            mt="2rem"
            id="canvas-container"
            onMouseMove={handleMouseEvent}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            border="1px solid black"
        >
          {room && 
            room.members.map(member => {
              return(
                member !== name ?
                <Box style={style} key={member}>
                  {member}
                </Box>
                :
                ""
              )
            })
          }
          {/* <ReactSketchCanvas
            width="100%"
            height="90%"
            strokeWidth={4}
            strokeColor="black"
            backgroundImage="https://upload.wikimedia.org/wikipedia/commons/7/70/Graph_paper_scan_1600x1000_%286509259561%29.jpg"
          /> */}
          <canvas ref={canvasRef}/>
        </Box>
        {room && <RoomDetail room={room} name={name} socket={socket}/>}
    </Box>
  );
};

export default Main;
