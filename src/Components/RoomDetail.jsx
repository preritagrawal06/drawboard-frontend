import { Box, Typography, IconButton, Button } from "@mui/material";
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useNavigate } from "react-router-dom";


const RoomDetail = ({room, name, chooseColor, socket}) => {

    const navigate = useNavigate()

    const copyToClipboard = ()=>{
        navigator.clipboard.writeText(room.code)
    }

    const handleLeaveRoom = ()=>{
        socket.emit("user:leave", {code: room.code, name: name})
        socket.disconnect()
        localStorage.removeItem('room')
        navigate('/', {replace: true})
    }

    return ( 
        <Box p="1rem" my="5rem" display="flex" flexDirection="column" alignItems="center" justifyContent="space-between" gap="1rem" borderRadius="1rem" border="1px solid black">
            <Box display="flex" flexDirection="column" alignItems="center" gap="1rem">
                <Typography variant="h4" color="initial" fontFamily="Cabin Sketch, sans-serif">Hello {name}</Typography>
                <Typography variant="p" color="initial"fontFamily="Cabin Sketch, sans-serif">
                    Your Room Code: {room.code} 
                    <IconButton aria-label="copy-button"  onClick={copyToClipboard}>
                        <ContentCopyIcon fontSize="small"/>
                    </IconButton>
                </Typography>
                <Box width="100%" display="flex" flexDirection="column">
                    <Typography variant="h5" fontFamily="Cabin Sketch, sans-serif">Members:</Typography>
                    {
                        room.members.map((member, index)=>{
                            return(
                                <Typography key={index} variant="h6" fontFamily="Cabin Sketch, sans-serif">
                                    {index+1}. {member} {name === member ? "(You)" : ""} {room.admin === member ? <WorkspacePremiumIcon sx={{color: "#FFD700"}}/> : ""}
                                </Typography>
                            )
                        })
                    }
                </Box>
            </Box>
            <Box display="flex" flexDirection="column" alignItems="center" gap="2rem">
                <input type="color" onChange={e  => {chooseColor(e.target.value)}}/>
                <Button variant="contained" color="error" onClick={handleLeaveRoom}>
                Leave Room
                </Button>
            </Box>
        </Box>
     );
}
 
export default RoomDetail;