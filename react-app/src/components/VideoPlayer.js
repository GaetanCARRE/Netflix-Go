
import React from 'react';
import ReactPlayer from 'react-player';

const VideoPlayer = () => {
    return (
        <div className='player-wrapper'>
            <ReactPlayer
            className='react-player fixed-bottom'
            url= 'Deadpool.MP4'
            width='100%'
            height='100%'
            controls = {true}
            

            />
        </div>
    );
}

export default VideoPlayer;