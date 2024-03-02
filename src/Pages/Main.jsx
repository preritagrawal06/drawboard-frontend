import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";
import RoomDetail from "../Components/RoomDetail";
import { Box, Typography } from "@mui/material";


const Main = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const canvasRef = useRef(null)
  const [ctx, setCtx] = useState(null)
  const [color, setColor] = useState('#000000')
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
    var height = document.getElementById('canvas-container').offsetHeight
    var width = document.getElementById('canvas-container').offsetWidth
    canvas.width = width
    canvas.height = height
    setCtx(canvas.getContext('2d'))

    const handleResize = ()=>{
      height = document.getElementById('canvas-container').offsetHeight
      width = document.getElementById('canvas-container').offsetWidth
      canvas.width = width
      canvas.height = height
    }

    window.addEventListener('resize', handleResize)

    return ()=>{
      window.removeEventListener('resize', handleResize)
    }

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
      // console.log(data.color)
      ctx.strokeStyle = data.color
      ctx.stroke()
    })

    socket.on("mouse:onDown", (data)=>{
      ctx.moveTo(data.x, data.y)
      ctx.beginPath()
    })
  }

  const handleMouseEvent = (e) => {
    var x, y
    if(e.type === 'touchmove'){
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    }else{
      x = e.clientX;
      y = e.clientY;
    }
    if(mouseDown){
      socket.emit('mouse:draw', {code, x, y, color})
      ctx.lineTo(x, y)
      ctx.strokeStyle = color
      ctx.stroke()
    }
    if(socket) socket.emit("mouse:move", {code, x, y, memberName: location.state.username})
  };

  const handleMouseDown = (e)=>{
    var x, y
    if(e.type === 'touchmove'){
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    }else{
      x = e.clientX;
      y = e.clientY;
    }
    ctx.moveTo(x, y)
    socket.emit("mouse:down", {code, x, y})
    setMouseDown(true)
  }

  const handleMouseUp = (e)=>{
    setMouseDown(false)
  }


  // callback function for roomDetails child component to handle change of color
  const chooseColor = (color)=>{
    setColor(color)
    ctx.beginPath() //This helps to change the color for the new  drawings
  }

  return (
    <Box
      width="100%"
      minHeight="100svh"
      bgcolor="white"
      display="flex"
      gap="2rem"
      justifyContent="center"
      sx={{flexDirection:{xs:"column", sm:"row"}, alignItems:{xs:"center", sm:"inherit"}}}
      >
        <Box
            width="80%"
            height="90vh"
            mt="2rem"
            id="canvas-container"
            onMouseMove={handleMouseEvent}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchMove={handleMouseEvent}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
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
                  bgcolor="red"
                  padding="0.25rem 0.5rem" 
                  key={member}
                >
                  <Typography variant="body1" fontWeight="600" fontSize="1rem" color="white">
                    {member}
                  </Typography>
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
        {room && <RoomDetail room={room} name={name} chooseColor={chooseColor} socket={socket}/>}
    </Box>
  );
};

export default Main;
