import React from 'react';

const AudioCard = ({audio}) => {
    return (
        <>
            <h1>{ audio.name } : { audio.type }</h1> 
            <audio controls>
            <source src={URL.createObjectURL(audio)} />
                Your browser does not support the audio tag.
            </audio>
        </>
     );
}
 
export default AudioCard;