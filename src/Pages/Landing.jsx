import { Box, TextField, Button } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Landing = () => {

    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [roomcode, setRoomcode] = useState('')
    
    const handleCreate = async()=>{
        try {
            if(!username){
                toast.error("Enter your name!")
            }else{
                const {data} = await axios.post('http://localhost:5000/api/room/create', {admin: username})
                if(data.success){
                    navigate(`/room/${data.room.code}`, {state:{code: data.room.code, username: username}})
                }else{
                    console.log("some error occured: ", data.message);
                }
            }
        } catch (error) {
            console.log("some error occured: ", error.message);
        }
    }

    const handleJoin = async()=>{
        try {
            if(!name || !roomcode){
                toast.error("Please fill name and room code")
            }
            else if(roomcode.length !== 6) toast.error("Check your room code")
            else{
                const {data} = await axios.post('http://localhost:5000/api/room/join',{username: name, room_code: roomcode})
                if(data.success){
                    navigate(`/room/${data.room.code}`, {state:{code: data.room.code, username: name}}) //TODO: Secure the room route so that not anyone can access the room. Use JWT and localstorage 
                } else{
                    toast.error(data.message)
                }
            }
        } catch (error) {
            toast.error("Room doesn't exist!")
        }
    }

    return ( 
        <>
            <Box minHeight="100svh" display="flex" alignItems="center" justifyContent="center">
                <Box className="landing-input-container" gap="2rem">
                    <Box display="flex" flexDirection="column" alignItems="center" gap="1rem">
                        <TextField
                        id="username"
                        label="Name"
                        value={username}
                        onChange={(e)=>{setUsername(e.target.value)}}
                        />
                        <Button variant="contained" color="primary" onClick={handleCreate}>
                        Create Room
                        </Button>
                    </Box>
                    <Box width="100%" display="flex" alignItems="center" justifyContent="center">
                        <hr style={{color:"black", width:"40%"}}/>
                        OR
                        <hr style={{color:"black", width:"40%"}}/>
                    </Box>
                    <Box display="flex" flexDirection="column" alignItems="center" gap="1rem">
                        <TextField
                        id="username"
                        label="Name"
                        value={name}
                        onChange={(e)=>{setName(e.target.value)}}
                        />
                        <TextField
                        id="roomcode"
                        label="Room Code"
                        value={roomcode}
                        onChange={(e)=>{setRoomcode(e.target.value)}}
                        />
                        <Button variant="contained" color="primary" onClick={handleJoin}>
                        Join Room
                        </Button>
                    </Box>
                </Box>
            </Box>
        </>
     );
}
 
export default Landing;