import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { PlaylistContext } from '../contexts/PlaylistContext';
import { Stack } from '@mui/system';
import { Grid, Typography } from '@mui/material';

const columns = [
    { id: 'title', label: 'Title', minWidth: 170 },
    { id: 'album', label: 'Album', minWidth: 100 },
    {
        id: 'date_added',
        label: 'Date Added',
        minWidth: 170,
        align: 'right'
    },
    {
        id: 'length',
        label: 'Length',
        minWidth: 170,
        align: 'right'
    }
];


;

export default function SongsTable() {
    const { songs } = React.useContext(PlaylistContext)

    function createData(title, album, date_added, length) {
        return { title, album, date_added, length };
    }

    const rows = songs ? songs.map(song => (
        createData({ title: song.track.name, artist: song.track.artists[0].name, 
            albumArt: song.track.album.images[0].url 
        }, song.track.album.name, song.added_at, song.track.duration)
    )) : []

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', alignItems: 'start' }}>
            <TableContainer sx={{ height: {xs: '100%', md: 'calc(100vh - 128px - 250px)'},mt: {xs: 'calc(408.680 + 64px)'} }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                            .map((row, index) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            if (column.id === 'title') {
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        <Grid container gap={2} alignItems='center' wrap='nowrap'> 
                                                        <img src={value.albumArt} height='40px' width='40px' />
                                                        <Stack direction='column'>
                                                            <Typography>{value.title}</Typography>
                                                            {value.artist}
                                                        </Stack>
                                                        </Grid>
                                                    </TableCell>
                                                )
                                            }
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.format && typeof value === 'number'
                                                        ? column.format(value)
                                                        : value}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}