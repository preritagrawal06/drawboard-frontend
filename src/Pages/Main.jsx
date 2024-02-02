import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";
import RoomDetail from "../Components/RoomDetail";
import { Box } from "@mui/material";


const Main = () => {
  const location = useLocation();
  const canvasRef = useRef(null)
  const [ctx, setCtx] = useState(null)
  const [x0cood, setX0cood] = useState(0);
  const [y0cood, setY0cood] = useState(0);
  const [x1cood, setX1cood] = useState(0);
  const [y1cood, setY1cood] = useState(0);
  const [x2cood, setX2cood] = useState(0);
  const [y2cood, setY2cood] = useState(0);
  const [x3cood, setX3cood] = useState(0);
  const [y3cood, setY3cood] = useState(0);
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
    const socketInstance = io(process.env.REACT_APP_BASE_URL);
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
      if(room){
        switch (data.memberName) {
          case room.members[0]:
            setX0cood(data.x);
            setY0cood(data.y);
            break;
          case room.members[1]:
            setX1cood(data.x);
            setY1cood(data.y);
            break;
          case room.members[2]:
            setX2cood(data.x);
            setY2cood(data.y);
            break;
          case room.members[3]:
            setX3cood(data.x);
            setY3cood(data.y);
            break;
        
          default:
            break;
        }
      }
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
    if(socket) socket.emit("mouse:move", {code, x, y, memberName: location.state.username})
  };

  const handleMouseDown = (e)=>{
    ctx.moveTo(e.clientX, e.clientY)
    socket.emit("mouse:down", {code, x: e.clientX, y: e.clientY})
    setMouseDown(true)
  }

  const handleMouseUp = (e)=>{
    setMouseDown(false)
  }

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
            room.members.map((member, index) => {
              var x, y;
              if(index === 0){
                x = x0cood
                y = y0cood
              }
              else if(index === 1){
                x = x1cood
                y = y1cood
              }
              if(index === 2){
                x = x2cood
                y = y2cood
              }
              if(index === 3){
                x = x3cood
                y = y3cood
              }
              return(
                member !== name ?
                <Box 
                  position="absolute" 
                  left={`${x}px`}
                  top={`${y}px`} 
                  border="1px solid red" 
                  padding="0.5rem" 
                  key={member}
                >
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
