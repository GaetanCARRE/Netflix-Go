
import React from 'react';
import ReactPlayer from 'react-player';

const VideoPlayer = (props) => {
    return (
        <div className='player-wrapper'>
            <ReactPlayer
            className='react-player fixed-bottom'
            url={props.path.startsWith('http') ? props.path : "/" + props.path}
            width='100%'
            height='100vh'
            controls={true}
            playing={true}
            />
        </div>
    );
}

export default VideoPlayer;