import React, { createContext, useState } from "react";
import axios from "axios";
import { saveAs } from 'file-saver';

export const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {

    const [playlists, setPlaylists] = useState([])
    const [activePlaylist, setActivePlaylist] = useState(null)
    const [user, setUser] = useState(null)
    const [songs, setSongs] = useState(null)
    const [loading, setLoading] = useState(false)
    const [token, setToken] = useState(null)

    const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    const getSongs = () => {
        if (activePlaylist) {
            axios.get(
                activePlaylist.tracks.href,
                {
                    headers
                })
                .then(({ data }) => {
                    const formattedSongs = data.items.map(song => {
                        const date = new Date(song.added_at)
                        const formattedDate = `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`
                        song.added_at = formattedDate

                        const minutes = Math.floor(Number(song.track.duration_ms) / 60000);
                        const seconds = ((Number(song.track.duration_ms) % 60000) / 1000).toFixed(0);
                        song.track.duration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

                        return song
                    })

                    setSongs(formattedSongs)
                    return data.items
                })
        }
    }

    const getUser = () => {
        axios({
            method: 'get',
            url: 'https://api.spotify.com/v1/me',
            headers
        })
            .then(({ data }) => {
                setUser(data)
            })
    }

    const createTextFile = async () => {

        if (activePlaylist) {
            setLoading(true)
            let songList = ''

            for (let i = 0; i < activePlaylist.tracks.total; i += 100) {
                await axios.get(
                    activePlaylist.tracks.href, { headers, params: { offset: i } })
                    .then(({ data }) => {
                        const result = data.items.map(song => {
                            const artists = song.track.artists.map(a => (
                                a.name
                            ))
                            return `${song.track.name} by ${artists.join(', ')}`
                        })
                        songList += result.join('\n')
                    })
            }
            const filename = `${activePlaylist.name}.txt`;
            const blob = new Blob([songList], { type: 'text/plain;charset=utf-8' });
            saveAs(blob, filename);
            setLoading(false)
        }
    }

    const createCSVFile = async () => {
        if (activePlaylist) {
            setLoading(true)
            let songList = []

            for (let i = 0; i < activePlaylist.tracks.total; i += 100) {
                await axios.get(
                    activePlaylist.tracks.href, { headers, params: { offset: i } })
                    .then(({ data }) => {
                        data.items.map((song) => {
                            console.log(song.added_at)
                            const date = new Date(song.added_at)
                            const formattedDate = `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`
                            song.added_at = formattedDate
                            const artists = song.track.artists.map(a => {
                                return a.name
                            }).join(', ')
                            songList.push({ title: `"${song.track.name}"`, artist: `"${artists}"`, album: `"${song.track.album.name}"`, date_added: song.added_at, SpotifyURI: song.track.uri, duration_ms: song.track.duration_ms, release_date: song.track.album.release_date })
                        })
                    })
            }

            let titles = ['Title,Artist,Album,Date_Added,Spotify_URI,Duration (ms),Release_Date']

            let csvData = songList.reduce((acc, song) => {
                const { title, artist, album, date_added, SpotifyURI, duration_ms, release_date } = song
                acc.push([title, artist, album, date_added, SpotifyURI, duration_ms, release_date].join(','))
                return acc
            }, [])

            const filename = `${activePlaylist.name}.csv`;
            const blob = new Blob([[...titles, ...csvData].join('\n')], { type: 'text/csv' });
            saveAs(blob, filename);
            setLoading(false)
        }
    }

    const getMyPlaylists = async () => {
        try {
            await axios.get(
                `https://api.spotify.com/v1/me/playlists`, { headers, params: { limit: 50 } })
                .then(({ data }) => {
                    setPlaylists(data.items)
                })
        } catch (e) {
            console.log(e)
            if (e.response.data.error.message === 'The access token expired') {
                setToken(null)
                window.localStorage.removeItem('token')
            }
        }
    }

    const copySongs = (inbox, storage) => {
        try {
            let inboxSongs = null
            let storageSongs = null
            axios.get(
                `https://api.spotify.com/v1/playlists/${inbox}/tracks`,
                {
                    headers
                })
                .then(({ data }) => {
                    inboxSongs = data.items.map(i => i.track.id)
                    axios.get(
                        `https://api.spotify.com/v1/playlists/${storage}/tracks`,
                        {
                            headers
                        })
                        .then(({ data }) => {
                            storageSongs = data.items.map(s => s.track.id)
                            let songs = []
                            if (inboxSongs.length) {
                                for (let song of inboxSongs) {
                                    if (!storageSongs.includes(song)) {
                                        songs.push(`spotify:track:${song}`)
                                    }
                                }
                            }
                            axios({
                                method: 'post',
                                url: `https://api.spotify.com/v1/playlists/${storage}/tracks`,
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json'
                                },
                                data: {
                                    uris: songs
                                }
                            })
                                .then(response => {
                                    console.log(`Added track to playlist!`);
                                })
                                .catch(error => {
                                    console.error(error);
                                });
                        })
                })
        } catch (e) {
            console.log(e)
        }
    }

    const logout = () => {
        window.localStorage.removeItem("token")
        setActivePlaylist(null)
        setSongs(null)
        setPlaylists([])
        setUser(null)
        setToken("")
    }

    return (
        <PlaylistContext.Provider value={{
            playlists, setPlaylists, activePlaylist, setActivePlaylist, token, setToken, getSongs, songs, setSongs, copySongs, getMyPlaylists, logout, copySongs, createCSVFile, createTextFile, loading, setLoading, user, getUser
        }}>
            {children}
        </PlaylistContext.Provider>
    )
}