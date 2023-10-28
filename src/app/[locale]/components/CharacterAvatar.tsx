import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CharacterAvatar = ({ onAvatarSelected }: any) => {
    const [ dataAvatar, setDataAvatar ] = useState([]);
    const [ hoverAvatar, setHoverAvatar ] = useState(null);

    useEffect(() => {
        getCharacterAvatar();
    }, []);

    const getCharacterAvatar = async () => {
        const responseAvatar = await axios.get('/data/character_avatar.json');
        const characterAvatar = responseAvatar.data;
        setDataAvatar(characterAvatar);
    };

    const handleMouseEnter = (index: any) => {
        setHoverAvatar(index);
    };
    
    const handleMouseLeave = () => {
        setHoverAvatar(null);
    };

    const handleAvatarClick = (selectedAvatar: any) => {
        onAvatarSelected(selectedAvatar);
    };

    return (
        <div className='side-panel-avatar'>
            <div className='item-container-avatar'>
                {dataAvatar.map((item: any, index: number) => (
                    <button
                        key={item.avatar_id}
                        className={`item-avatar ${hoverAvatar === index ? 'hover' : ''}`}
                        style={{backgroundImage: `url(${item.avatar_img})`}}
                        onClick={() => handleAvatarClick(item)}
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseLeave={handleMouseLeave}
                    >
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CharacterAvatar;