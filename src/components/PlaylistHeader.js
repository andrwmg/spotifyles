import { Download } from "@mui/icons-material"
import { CircularProgress, Grid, IconButton, Typography } from "@mui/material"
import { Box, Stack } from "@mui/system"
import React, { useContext } from "react"
import { PlaylistContext } from "../contexts/PlaylistContext"


export default function PlaylistHeader() {

    const {activePlaylist, createCSVFile, loading, setLoading} = useContext(PlaylistContext)

    const handleBackUp = () => {
        setLoading(true)
        createCSVFile()
    }

    return (
        <Grid container item p={4} borderBottom='1px solid black' bgcolor='background.default' zIndex={1} gap={4}>
            {activePlaylist && activePlaylist.images.length ?
                <img src={activePlaylist.images[0].url} height='250px' width='250px' />
                :
                <Box sx={{ height: '250px', width: '250px' }}></Box>
            }
            <Stack spacing={4}>
                <Typography variant='h1' fontSize={40}>{activePlaylist.name}</Typography>
                <Box>
                    <IconButton onClick={handleBackUp} disabled={loading} size='large'>
                        {loading ?
                            <Box sx={{ height: '24px', width: '24px' }}>

                                <CircularProgress sx={{ maxHeight: '100%', maxWidth: '100%' }} />
                            </Box>

                            :
                            <Download />
                        }
                    </IconButton>
                </Box>
            </Stack>
        </Grid>
    )
}