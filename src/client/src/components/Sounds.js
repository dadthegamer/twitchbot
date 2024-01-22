import React, { useEffect, useState } from 'react';
import '../styles/GUI/sounds.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle, faTrash } from '@fortawesome/free-solid-svg-icons';


function Sounds() {
    const [sounds, setSounds] = useState([]);
    const [newSound, setNewSound] = useState(false);


    useEffect(() => {
        fetch('/api/sounds')
            .then((res) => res.json())
            .then((data) => setSounds(data));
    }, []);

    const createNewSound = () => {
        setNewSound(true);
    };

    // Handle the submit of the new sound form. Upload the file to the server
    const handleNewSoundSubmit = (e) => {
        e.preventDefault();
        const form = document.getElementById('new-sound-form');
        const formData = new FormData(form);
        fetch('/api/sounds', {
            method: 'POST',
            body: formData,
        })
            .then((res) => res.json())
            .then((data) => {
                setSounds([...sounds, data]);
                setNewSound(false);
            });
    };

    // Handle the cancel of the new sound form. Clear the form and hide it
    const handleCancel = (e) => {
        e.preventDefault();
        const form = document.getElementById('new-sound-form');
        form.reset();
        setNewSound(false);
    };

    // Handle the play of a sound
    const handlePlaySound = (e) => {
        const soundLocation = e.target.parentElement.getAttribute('data-location');
        console.log(soundLocation);
        const sound = new Audio(soundLocation);
        sound.play();
    };

    return (
        <div className="content">
            <div className='add-sound-button-container'>
                <button id='add-sound-button' onClick={createNewSound}>Add Sound</button>
            </div>
            <div className='sounds-container'>
                {sounds.map((sound) => (
                    <div className='sound-container' key={sound._id} data-name={sound.soundName} data-location={sound.location}>
                        <FontAwesomeIcon icon={faPlayCircle} className='play-icon' onClick={handlePlaySound} />
                        <span className='sound-name'>{sound.soundName}</span>
                    </div>
                ))}
            </div>
            {newSound ?
                <div className='new-sound-form'>
                    <form id='new-sound-form'>
                        <label htmlFor='name'>Sound Name</label>
                        <input type='text' name='name' id='name' />
                        <label htmlFor='file'>Sound File</label>
                        <input type='file' name='file' id='file' />
                        <div className='new-sound-form-buttons'>
                            <button type='submit' id='submit' onClick={handleNewSoundSubmit}>Submit</button>
                            <button type='cancel' id='cancel' onClick={handleCancel}>Cancel</button>
                        </div>
                    </form>
                </div> : null}
        </div>
    )
}


export default Sounds;