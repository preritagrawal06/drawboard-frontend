import { Box, Typography, IconButton } from "@mui/material";
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const RoomDetail = ({room, name}) => {

    const copyToClipboard = ()=>{
        navigator.clipboard.writeText(room.code)
    }

    return ( 
        <Box p="1rem" my="5rem" display="flex" flexDirection="column" alignItems="center" gap="1rem" borderRadius="1rem" border="1px solid black">
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
     );
}
 
export default RoomDetail;