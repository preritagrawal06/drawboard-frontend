import { Navigate } from "react-router-dom";

const RouteProtector = ({children})=>{
    const room = localStorage.getItem('room')
    const access = room ? children : <Navigate to="/" replace/>
    return access
}

export default RouteProtector;   