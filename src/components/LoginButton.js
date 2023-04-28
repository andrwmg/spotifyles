import { Button } from "@mui/material";
import React from "react";

export default function LoginButton () {

    const end_point = process.env.REACT_APP_AUTH_ENDPOINT
    const client_id = process.env.REACT_APP_CLIENT_ID
    const redirect_uri = process.env.REACT_APP_REDIRECT_URI
    const response_type = process.env.REACT_APP_RESPONSE_TYPE

    return (
        <Button
                // onClick={login}
                href={`${end_point}?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=playlist-modify-public%20app-remote-control%20user-read-currently-playing%20streaming%20playlist-read-collaborative%20user-read-playback-position%20user-top-read%20user-read-recently-played%20user-library-read%20user-read-private%20user-read-email`} variant='contained'
            sx={{height: '64px', width: '128px'}}
                >Log In</Button>
    )
}