import React, { Component } from "react";

const styles = {
    volumeControl: {
        display: "none",
        position: "absolute",
        right: "0",
        bottom: "0",
        width: "20%"
    }
}

class PlayerBar extends Component {
    render() {
        return (
            <section className="player-bar">
                <section id="song">
                    <img src={this.props.album.albumCover} alt={this.props.album.albumTitle} className="ui tiny image"/>
                    <div id="song-info" className="left">
                        <div className="ui header">{this.props.currentSong.title}</div>
                        <div>{this.props.album.artist}</div>
                    </div>
                </section>
                <section id="buttons">
                    <button id="previous" className="ui button" onClick={this.props.handlePrevClick}>
                        <span className="ion-md-skip-backward"></span>
                    </button>
                    <button id="play-pause" className="ui button" onClick={this.props.handleSongClick}>
                        <span className={this.props.isPlaying ? "ion-md-pause" : "ion-md-play"}></span>
                    </button>
                    <button id="next" className="ui button" onClick={this.props.handleNextClick}>
                        <span className="ion-md-skip-forward"></span>
                    </button>
                </section>
                <section id="time-control">
                    <div className="current-time ui label" styles={styles.timer}>{this.props.formatTime(this.props.currentTime)}</div>
                    <input
                        type="range"
                        className="seek-bar"
                        value={(this.props.currentTime / this.props.duration) || 0}
                        max="1"
                        min="0"
                        step="0.01"
                        onChange={this.props.handleTimeChange}
                    />
                    <div className="total-time ui label">{this.props.formatTime(this.props.duration)}</div>
                </section>
                <section id="volume-control">
                    <div className="ion-md-volume-low ui label"></div>
                    <input
                        type="range"
                        className="seek-bar"
                        value={this.props.volume}
                        max="1"
                        min="0"
                        step="0.01"
                        onChange={this.props.handleVolumeChange}
                    />
                <div className="ion-md-volume-high ui label"></div>
                </section>
            </section>
        );
    }
}

export default PlayerBar;
