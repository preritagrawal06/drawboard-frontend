import { Box, Typography, IconButton, Button } from "@mui/material";
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useNavigate } from "react-router-dom";


const RoomDetail = ({room, name, socket}) => {

    const navigate = useNavigate()

    const copyToClipboard = ()=>{
        navigator.clipboard.writeText(room.code)
    }

    const handleLeaveRoom = ()=>{
        socket.emit("user:leave", {code: room.code, name: name})
        socket.disconnect()
        navigate('/', {replace: true})
    }

    return ( 
        <Box p="1rem" my="5rem" display="flex" flexDirection="column" alignItems="center" justifyContent="space-between" gap="1rem" borderRadius="1rem" border="1px solid black">
            <Box display="flex" flexDirection="column" alignItems="center" gap="1rem">
                <Typography variant="h4" color="initial">Hello {name}</Typography>
                <Typography variant="p" color="initial">
                    Your Room Code: {room.code} 
                    <IconButton aria-label="copy-button"  onClick={copyToClipboard}>
                        <ContentCopyIcon fontSize="small"/>
                    </IconButton>
                </Typography>
                <Box width="100%" display="flex" flexDirection="column">
                    <Typography variant="h5">Members:</Typography>
                    {
                        room.members.map((member, index)=>{
                            return(
                                <Typography key={index} variant="h6">
                                    {index+1}. {member} {name === member ? "(You)" : ""} {room.admin === member ? <WorkspacePremiumIcon sx={{color: "#FFD700"}}/> : ""}
                                </Typography>
                            )
                        })
                    }
                </Box>
            </Box>
            <Button variant="contained" color="error" onClick={handleLeaveRoom}>
              Leave Room
            </Button>
        </Box>
     );
}
 
export default RoomDetail;