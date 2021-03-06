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
            currentTime: 0,
            duration: album.songs[0].duration,
            volume: 0.5,    //default volume 50%
            isPlaying: false,
            hoveredSong: null
        }

        this.audioElement = document.createElement("audio");
        this.audioElement.src = album.songs[0].audioSrc;
        this.audioElement.volume = this.state.volume;
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

    formatTime(time) {
        const parsedTime = parseInt(time, 10);
        if(isNaN(parsedTime)) {
            return "-:--";
        }

        const roundedTime = Math.round(parsedTime);
        const minutes = Math.floor(roundedTime / 60);
        const seconds = roundedTime % 60;
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
        return `${minutes}:${formattedSeconds}`;
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

    handleNextClick() {
        const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
        const newIndex = Math.min(currentIndex + 1, this.state.album.songs.length - 1);
        const newSong = this.state.album.songs[newIndex];
        this.setSong(newSong);
        this.play();
    }

    handleTimeChange(e) {
        const newTime = this.audioElement.duration * e.target.value;
        this.audioElement.currentTime = newTime;
        this.setState({currentTime: newTime});
    }

    handleVolumeChange(e) {
        const newVolume = e.target.value;
        this.audioElement.volume = newVolume;
        this.setState({volume: newVolume});
    }

    componentDidMount() {
        this.eventListeners = {
            timeupdate: e => {
                this.setState({currentTime: this.audioElement.currentTime});
                //Autoplay
                if(this.state.currentTime === this.state.duration) {
                    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
                    if(currentIndex < this.state.album.songs.length -1) {
                        this.handleNextClick();
                    }
                }
            },
            durationchange: e => {
                this.setState({duration: this.audioElement.duration});
            },
            volumechange: e => {
                this.setState({volume: this.audioElement.volume});
            }
        }
        this.audioElement.addEventListener("timeupdate", this.eventListeners.timeupdate);
        this.audioElement.addEventListener("durationchange", this.eventListeners.durationchange);
        this.audioElement.addEventListener("volumechange", this.eventListeners.volumechange);
    }

    componentWillUnmount() {
        this.audioElement.src = null;
        this.audioElement.removeEventListener("timeupdate", this.eventListeners.timeupdate);
        this.audioElement.removeEventListener("durationchange", this.eventListeners.durationchange);
        this.audioElement.removeEventListener("volumechange", this.eventListeners.volumechange);
    }

    render() {
        return (
            <section className="album">
                <section id="content">
                    <section id="album-info">
                        <img id="album-cover-art" className="ui image medium centered" src={this.state.album.albumCover} alt={this.state.album.albumTitle} />
                        <div className="album-details">
                            <h1 id="album-title">{this.state.album.title}</h1>
                            <h2 className="artist">{this.state.album.artist}</h2>
                            <div id="release-info">{this.state.album.releaseInfo}</div>
                        </div>
                    </section>
                    <table id="song-list" className="ui selectable very basic collapsing table">
                        <colgroup>
                            <col id="song-number-column" />
                            <col id="song-title-column" />
                            <col id="song-duration-column" />
                        </colgroup>
                        <thead>
                            <tr>
                                <th className="collapsing padded">#</th>
                                <th>Title</th>
                                <th className="collapsing">Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.album.songs.map( (song, index) =>
                                    <tr key={index} className="song" onClick={() => this.handleSongClick(song)} onMouseEnter={() => this.hoverEnterSong(song)} onMouseLeave={() => this.hoverExitSong()}>
                                        <td className="song-number center aligned padded">
                                            {/*If the hovered song is this song, display play button unless this song is currently playing, then display pause button ELSE display track number. */}
                                            {/*This is a complex nest of if statements for display, and would probably be better solved with another component instead. */}

                                            {
                                                this.state.hoveredSong === song ? (
                                                    <span className={(this.state.isPlaying && this.state.currentSong === song) ? "ion-md-pause" : "ion-md-play"}></span>
                                                ) : (index + 1)
                                            }
                                        </td>
                                        <td className="song-title">{song.title}</td>
                                        <td className="song-duration center aligned">{this.formatTime(song.duration)}</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </section>

                <PlayerBar
                    album={this.state.album}
                    isPlaying={this.state.isPlaying}
                    currentSong={this.state.currentSong}
                    currentTime={this.audioElement.currentTime}
                    duration={this.audioElement.duration}
                    volume={this.audioElement.volume}
                    handleSongClick={() => this.handleSongClick(this.state.currentSong)}
                    handlePrevClick={() => this.handlePrevClick()}
                    handleNextClick={() => this.handleNextClick()}
                    handleTimeChange={(e) => this.handleTimeChange(e)}
                    handleVolumeChange={(e) => this.handleVolumeChange(e)}
                    formatTime={(time) => this.formatTime(time)}
                />
            </section>
        );
    }
}

export default Album;
