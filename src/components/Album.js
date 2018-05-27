import React, { Component } from 'react';
import albumData from './../data/albums.js';
import PlayerBar from './PlayerBar';

class Album extends Component {
    constructor(props) {
        super(props);

        const album = albumData.find(album => {
            return album.slug === this.props.match.params.slug;
        });

        this.state = {
            album: album,
            currentSong: album.songs[0],
            isPlaying: false,
            hoveredSong: null
        }

        this.audioElement = document.createElement("audio");
        this.audioElement.src = album.songs[0].audioSrc;
    }

    play() {
        this.audioElement.play();
        this.setState({isPlaying: true});
    }

    pause() {
        this.audioElement.pause();
        this.setState({isPlaying: false});
    }

    setSong(song) {
        this.audioElement.src = song.audioSrc;
        this.setState({currentSong: song});
    }

    handleSongClick(song) {
        const isSameSong = this.state.currentSong === song;
        if(this.state.isPlaying && isSameSong) {
            this.pause();
        } else {
            if(!isSameSong) { this.setSong(song); }
            this.play();
        }
    }

    hoverEnterSong(song) {
        this.setState({hoveredSong: song});
    }

    hoverExitSong() {
        this.setState({hoveredSong: null})
    }

    handlePrevClick() {
        const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
        const newIndex = Math.max(0, currentIndex - 1);
        const newSong = this.state.album.songs[newIndex];
        this.setSong(newSong);
        this.play();
    }

    render() {
        return (
            <section className="album">
                <section id="album-info">
                    <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.albumTitle} />
                    <div className="album-details">
                        <h1 id="album-title">{this.state.album.albumTitle}</h1>
                        <h2 className="artist">{this.state.album.artist}</h2>
                        <div id="release-info">{this.state.album.releaseInfo}</div>
                    </div>
                </section>
                <table id="song-list">
                    <colgroup>
                        <col id="song-number-column" />
                        <col id="song-title-column" />
                        <col id="song-duration-column" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>Track</th>
                            <th>Title</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.album.songs.map( (song, index) =>
                                <tr key={index} className="song" onClick={() => this.handleSongClick(song)} onMouseEnter={() => this.hoverEnterSong(song)} onMouseLeave={() => this.hoverExitSong()}>
                                    <td className="song-number">
                                        {/*If the hovered song is this song, display play button unless this song is currently playing, then display pause button ELSE display track number. */}
                                        {/*This is a complex nest of if statements for display, and would probably be better solved with another component instead. */}

                                        {
                                            this.state.hoveredSong === song ? (
                                                <span className={(this.state.isPlaying && this.state.currentSong === song) ? "ion-md-pause" : "ion-md-play"}></span>
                                            ) : (index + 1)
                                        }
                                    </td>
                                    <td className="song-title">{song.title}</td>
                                    <td className="song-duration">{song.duration}</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
                <PlayerBar
                    isPlaying={this.state.isPlaying}
                    currentSong={this.state.currentSong}
                    handleSongClick={() => this.handleSongClick(this.state.currentSong)}
                    handlePrevClick={() => this.handlePrevClick()}
                />
            </section>
        );
    }
}

export default Album;
