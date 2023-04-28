import React, { useEffect } from 'react'
import { Grid } from '@mui/material'
import { PlaylistContext } from '../contexts/PlaylistContext'
import SongsTable from './SongsTable'
import PlaylistHeader from './PlaylistHeader'
import LoginButton from './LoginButton'



export default function Main() {



    const { activePlaylist, getSongs, token, setToken, getMyPlaylists, getUser } = React.useContext(PlaylistContext)

    useEffect(() => {
        const hash = window.location.hash
        let token = window.localStorage.getItem("token")

        if (!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

            window.location.hash = ""
            window.localStorage.setItem("token", token)
        }

        setToken(token)
    }, [])

    useEffect(() => {
        if (token) {
            getMyPlaylists()
            getUser()
        }
    }, [token])

    React.useEffect(() => {
        getSongs()
    }, [activePlaylist])

    return (
        <Grid container p={0} overflow='hidden' height='calc(100vh - 64px)' justifyContent='center' alignItems={token ? 'start' : 'center'}>
            {!token ?
                <LoginButton />
                :
                <>
                    {activePlaylist ?
                        <>
                            <PlaylistHeader />
                            <SongsTable />
                        </> : null
                    }
                </>
            }
        </Grid >
    )
}