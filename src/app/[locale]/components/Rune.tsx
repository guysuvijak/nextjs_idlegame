import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Rune = () => {
    const [ dataRune, setDataRune ] = useState<any>([]);

    useEffect(() => {
        getCharacterAvatar();
    }, []);

    const getCharacterAvatar = async () => {
        const responseRune = await axios.get('/data/rune.json');
        const runeList = responseRune.data;
        setDataRune(runeList);
    };

    return (
        <div className='side-panel-rune'>
            <div className='flex bg-slate-400 mt-2 px-2 py-2'>
                <div className='item-rune-img'>
                    <div style={{position: 'absolute', width: 75, height: 75, backgroundImage: `url(${dataRune[0]?.rune_img})`, zIndex: 3, backgroundSize: 'cover'}}></div>
                </div>
                <div className='flex-1 ml-2'>
                    <div className='flex flex-row'>
                        <p className='font-medium text-cyan-200 pl-[2px]'>Discover Rune</p>
                        <p className='font-medium text-white ml-[8px]'>Lv.1</p>
                    </div>
                    <div className='flex flex-row justify-between'>
                        <div className='flex-1 min-h-[50px] item-rune-desc mr-[15px]'>
                            <p>Discover Rune that has various abilities.</p>
                        </div>
                        <button className='w-[150px] bg-blue-700 text-white border-[1px] border-white'>
                            3,000 Core
                        </button>
                    </div>
                </div>
            </div>
            <div className='item-container-rune'>
                {dataRune.map((item: any, index: number) => (
                    <div
                        key={item.avatar_id}
                        className='item-rune'
                        style={{backgroundImage: `url(${item.avatar_img})`}}
                    >
                        <div className='item-rune-img'>
                            <div style={{position: 'absolute', width: 75, height: 75, backgroundImage: `url(${item.rune_img})`, zIndex: 3, backgroundSize: 'cover'}}></div>
                        </div>
                        <div className='flex-1 ml-2'>
                            <div className='flex flex-row justify-between'>
                                <div className='font-medium text-orange-600 pl-[2px]'>{item.rune_name}</div>
                                <div className='font-medium text-slate-500'>Max Lv.{item.rune_maxlevel}</div>
                            </div>
                            <div className='item-rune-desc'>
                                <p>{item.rune_desc}</p>
                                <p>{`${item.rune_base} > ${item.rune_base + (item.rune_base * item.rune_multiple)}`}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Rune;