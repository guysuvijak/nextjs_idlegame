'use client'
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { HeartIcon, PlusCircleIcon, MinusCircleIcon, PencilIcon } from '@heroicons/react/24/solid';
import axios from 'axios';

import ProgressBar from '../components/ProgressBar';
import Inventory from '../components/Inventory';
import CharacterAvatar from '../components/CharacterAvatar';
import Rune from '../components/Rune';
import Relic from '../components/Relic';

interface MonsterProps {
    id: number;
    name: string;
    level: number;
    minHp: number;
    maxHp: number;
    damage: number;
    attack_speed: number;
    exp: number;
    drops: MonsterDrop[];
  }
  
  interface MonsterDrop {
    item_id: number;
    item_name: string;
    drop_chance: number;
  }

const stats = {
    physical_attack: 0,
    magic_attack: 0,
    attack_speed: 0,
    critical: 0,
    critical_damage: 0,
    hit: 0,
    defense: 0,
    hp: 0,
    mp: 0,
};

const equipment = {
    helmet: {name: 'Lord Helmet', img: '/helmet.webp'},
    armor: {name: 'Lord Armor', img: '/armor.webp'},
    gloves: {name: 'Lord Gloves', img: '/gloves.webp'},
    boots: {name: 'Lord Boots', img: '/boots.webp'},
    weapon: {name: 'Lord Sword', img: '/sword.webp'},
    earrings: {name: '', img: ''},
    necklace: {name: '', img: ''},
    belt: {name: '', img: ''}
};

const inventoryData = [
    { item_id: 1, item_name: 'Lord Boots', item_desc: 'boots', item_type: 'equipment', item_grade: 'S', item_img: '/boots.webp', item_qty: 1, item_trade: false},
    { item_id: 2, item_name: 'Lord Armor', item_desc: 'armor', item_type: 'equipment', item_grade: 'S', item_img: '/armor.webp', item_qty: 1, item_trade: false},
    { item_id: 3, item_name: 'Lord Sword', item_desc: 'sword', item_type: 'equipment', item_grade: 'S', item_img: '/sword.webp', item_qty: 1, item_trade: false},
    { item_id: 4, item_name: 'Mushroom', item_desc: 'drop from "LEVEL 3 - Mush Kid"', item_type: 'etc', item_grade: 'D', item_img: '/mushroom.png', item_qty: 16, item_trade: true},
];

const Game = () => {
    const t = useTranslations('game');

    const [ mainCharacter, setMainCharacter ] = useState({minHp: 100, maxHp: 100, minMp: 10, maxMp: 10, minExp: 0, maxExp: 5, damage: 10});
    const [ mainCharacterProfile, setMainCharacterProfile ] = useState({name: 'MeteorVIIx', avatar: 'https://cdn.discordapp.com/attachments/1160604529432207370/1160604553419440249/Icons_01-export.png?ex=65354438&is=6522cf38&hm=b2d5c47f52ad0499bbd4c2c5acca325b0ed998ad14590dca59f94a2e42801c37&', level: 1, statusPoint: 10});
    const [ mainCharacterStatus, setMainCharacterStatus ] = useState({str: 1, agi: 1, vit: 1, int: 1, dex: 1, luk: 1});
    const [ monster, setMonster ] = useState<MonsterProps>();
    const [ monsterCount, setMonsterCount ] = useState(0);
    const [ monsterTime, setMonsterTime ] = useState(60);
    const [ presetSelected, setPresetSelected ] = useState(1);
    const [ statusSwitch, setStatusSwitch ] = useState(1);
    const [ upgradeSwitch, setUpgradeSwitch ] = useState(1);
    const [ specialSwitch, setSpecialSwitch ] = useState(1);

    const [ inventory, setInventory ] = useState([]);
    const [ isEquipWeapon, setIsEquipWeapon ] = useState(false);
    const [ isEquipHelmet, setIsEquipHelmet ] = useState(false);
    const [ isEquipChest, setIsEquipChest ] = useState(false);
    const [ isEquipGloves, setIsEquipGloves ] = useState(false);
    const [ isEquipBoots, setIsEquipBoots ] = useState(false);
    const [ animationEquipmentFrame, setAnimationEquipmentFrame ] = useState(1);

    const [ hoverAvatar, setHoverAvatar ] = useState(false);
    const [ showAvatarList, setShowAvatarList ] = useState(false);
    
    const [ tempStatus, setTempStatus ] = useState<any>({str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0, point: 0});

    useEffect(() => {
        getDataMonster();
        // eslint-disable-next-line
    }, [monsterCount]);

    const getDataMonster = async () => {
        try {
            const responseMonster = await axios.get('/data/monsters.json');
            const monsterIndex = Math.floor(monsterCount / 10);
            setMonster(responseMonster.data[monsterIndex]);
        } catch (err) {
            console.log('error get data monster =', err);
        }
    };

    const resetCharacterAndMonster = () => {
        setMainCharacter(prevCharacter => ({
            ...prevCharacter,
            minHp: mainCharacter.maxHp
        }));
        if(monster) {
            setMonster({
                ...monster,
                minHp: monster.maxHp
            });
        }
        
        setMonsterTime(61);
    };
    
    const handleMonsterDamage = () => {
        if (monster) {
            if (monster.damage > 0 && mainCharacter.minHp > 0) {
                setMainCharacter(prevCharacter => ({
                    ...prevCharacter,
                    minHp: Math.max(0, prevCharacter.minHp - monster.damage)
                }));
                if (mainCharacter.minHp <= monster.damage) {
                    resetCharacterAndMonster();
                }
            }
        }
    };
    
    const handleMonsterTime = () => {
        if (monsterTime > 0) {
            setMonsterTime(prevMonsterTime => prevMonsterTime - 1);
        } else {
            resetCharacterAndMonster();
        }
    };
    
    useEffect(() => {
        if(monster) {
            const damageIntervalId = setInterval(() => {
                handleMonsterDamage();
            }, monster.attack_speed * 1000);
            const timeIntervalId = setInterval(() => {
                handleMonsterTime();
            }, 1000);
            
            return () => {
                clearInterval(damageIntervalId);
                clearInterval(timeIntervalId);
            };
        }
        // eslint-disable-next-line
    }, [monster?.damage, mainCharacter?.minHp]);

    useEffect(() => {
        handleGainedExp();
        // eslint-disable-next-line
    }, [mainCharacter.minExp]);

    const viewStatus = Object.entries(mainCharacterStatus).map(([key, value]) => (
        <div key={key} className='text-center'>
            <div className='flex flex-row justify-center items-center my-2'>
                <p className='w-[50px] text-left font-medium'>{t(`short_${key}`).toUpperCase()}</p>
                <div className='w-[80px] flex flex-row justify-center rounded-lg bg-slate-500 border-2 border-[#ababab] text-white font-medium text-center mx-5'>
                <p>{value}</p>
                <p className='text-yellow-300' style={{display: tempStatus[key] === 0 ? 'none' : 'flex'}}>{`+${tempStatus[key]}`}</p>
                </div>
                    {(mainCharacterProfile.statusPoint !== 0) &&
                        <div className='flex flex-row'>
                            <button disabled={tempStatus[key] === 0} onClick={() => onPressStatus(key, '-')}>
                                <MinusCircleIcon className='h-7 w-7' style={{color: tempStatus[key] > 0 ? '#FF2427' : '#ababab'}} />
                            </button>
                            <button disabled={mainCharacterProfile.statusPoint === 0 || mainCharacterProfile.statusPoint - tempStatus.point === 0} onClick={() => onPressStatus(key, '+')}>
                                <PlusCircleIcon className='h-7 w-7 text-green-600' style={{color: (mainCharacterProfile.statusPoint - tempStatus.point === 0) ? '#ababab' : '#13B714'}} />
                            </button>
                        </div>
                    }
            </div>
        </div>
    ));

    const viewDetail = Object.entries(stats).map(([key, value]) => (
        <div key={key} className='flex flex-row text-center justify-center'>
            <div className='w-[70%] text-left'>{t(`${key}`)}</div>
            <div className='w-[30%] text-right'>{value}</div>
        </div>
    ));

    const onPressPreset = (preset: number) => {
        setPresetSelected(preset);
    };

    const onPressStatusSwitch = (select: number) => {
        setStatusSwitch(select);
    };

    const onPressUpgradeSwitch = (select: number) => {
        setUpgradeSwitch(select);
    };

    const onPressSpecialSwitch = (select: number) => {
        setSpecialSwitch(select);
    };

    const onPressAttack = (monsterHp: number, damage: number) => {
        const resultHp = monsterHp - damage;
        if(resultHp <= 0) {
            if(monster) {
                onKillMonster();
            }
        } else {
            setMonster((prev: any) => ({...prev, minHp: resultHp}));
        }
    };

    const onKillMonster = () => {
        if (monster) {
            setMainCharacter((prev) => ({ ...prev, minExp: prev.minExp + monster.exp }));
            setMonsterCount((prev) => prev + 1);
            setMonster((prev: any) => ({ ...prev, minHp: 100 }));
            setMonsterTime(60);

            const droppedItems = monster.drops.filter((drop) => Math.random() <= drop.drop_chance);
            onItemDrop(droppedItems);
        }
    };

    const onItemDrop = (item: any) => {

    };

    const onPressStatus = (status: any, action: string) => {
        const blockUnexpected = tempStatus[status] < mainCharacterProfile.statusPoint;
        if(action === '+') {
            if(mainCharacterProfile.statusPoint > 0 && blockUnexpected) {
                setTempStatus((prev: any) => ({...prev, [status]: prev[status] + 1, point: prev.point + 1}));
            }
        } else {
            if(tempStatus[status] > 0) {
                setTempStatus((prev: any) => ({...prev, [status]: prev[status] - 1, point: prev.point - 1}));
            }
        }
    };

    const onPressSubmitStatus = () => {
        setMainCharacterStatus((prev: any) => ({
            ...prev,
            str: prev.str + tempStatus.str,
            agi: prev.agi + tempStatus.agi,
            vit: prev.vit + tempStatus.vit,
            int: prev.int + tempStatus.int,
            dex: prev.dex + tempStatus.dex,
            luk: prev.luk + tempStatus.luk,
        }));
        setMainCharacterProfile((prev: any) => ({...prev, statusPoint: prev.statusPoint - tempStatus.point}));
        setTempStatus({str: 0, agi: 0, vit: 0, int: 0, dex : 0, luk: 0, point: 0});
    };

    const handleGainedExp = () => {
        if(mainCharacter.minExp >= mainCharacter.maxExp) {
            setMainCharacterProfile(prev => ({...prev, level: prev.level + 1, statusPoint: prev.statusPoint + 1}));
            if(mainCharacter.minExp > mainCharacter.maxExp) {
                setMainCharacter(prev => ({...prev, minExp: mainCharacter.minExp - mainCharacter.maxExp, maxExp: Number((prev.maxExp * 1.5).toFixed(0))}))
            } else {
                setMainCharacter(prev => ({...prev, minExp: 0, maxExp: Number((prev.maxExp * 1.5).toFixed(0))}))
            }
        }
    };

    const onHoverAvatar = (action: string) => {
        if(action === 'enter') {
            setHoverAvatar(true);
        } else {
            setHoverAvatar(false);
        }
    };

    const handleAvatarSelected = (selectedAvatar: any) => {
        const avatarId = selectedAvatar.avatar_img;
        setMainCharacterProfile(prev => ({...prev, avatar: avatarId}));
        setShowAvatarList(false);
    };

    const handleEquipmentChange = (type: string) => {
        if (isEquipWeapon || isEquipHelmet || isEquipChest || isEquipGloves || isEquipBoots) {
          setAnimationEquipmentFrame(1);
        }
        if(type === 'weapon') {
            setIsEquipWeapon(prev => !prev);
        } else if (type === 'helmet') {
            setIsEquipHelmet(prev => !prev);
        } else if (type === 'chest') {
            setIsEquipChest(prev => !prev);
        } else if (type === 'gloves') {
            setIsEquipGloves(prev => !prev);
        } else if (type === 'boots') {
            setIsEquipBoots(prev => !prev);
        }
    };

    return (
        <div>
            <div className='flex flex-row justify-between my-5'>
                <div className='w-[33%] flex-1 justify-center ml-5'>
                    <div className='bg-slate-500 text-center text-white font-bold py-2 rounded-tl-2xl rounded-tr-2xl'>
                        <h1>[ {t('title_character')} ]</h1>
                    </div>
                    <div className='bg-white p-5 border-b-2 border-[#ababab]'>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <div className='relative'>
                                <div
                                    className='bg-red-500 mr-5 w-[100px] h-[100px] relative justify-center items-center cursor-pointer'
                                    onClick={() => setShowAvatarList(prev => !prev)}
                                    onMouseEnter={() => onHoverAvatar('enter')}
                                    onMouseLeave={() => onHoverAvatar('leave')}
                                >
                                    {hoverAvatar &&
                                        <div>
                                            <PencilIcon className='w-[40px] h-[40px] absolute z-[5] text-white right-8 bottom-8' />
                                            <div className='w-[100px] h-[100px] absolute z-2 bg-slate-800 opacity-50'></div>
                                        </div>
                                    }
                                    <div className='w-[100px] h-[100px]' style={{backgroundImage: `url(${mainCharacterProfile.avatar})`, backgroundSize: 'cover'}}></div>
                                </div>
                                {showAvatarList &&
                                    <CharacterAvatar onAvatarSelected={handleAvatarSelected} />
                                }
                            </div>
                            <div className='flex-1'>
                                <div className='font-medium'>{t('name_level', {name: mainCharacterProfile.name, level: mainCharacterProfile.level})}</div>
                                <div className='flex flex-row items-center'>
                                    <div className='w-12'>{t('short_hp').toUpperCase()}</div>
                                    <ProgressBar name='hp' min={mainCharacter.minHp} max={mainCharacter.maxHp} />
                                </div>
                                <div className='flex flex-row items-center'>
                                    <div className='w-12'>{t('short_mp').toUpperCase()}</div>
                                    <ProgressBar name='mp' min={mainCharacter.minMp} max={mainCharacter.maxMp} />
                                </div>
                                <div className='flex flex-row items-center'>
                                    <div className='w-12'>{t('short_exp').toUpperCase()}</div>
                                    <ProgressBar name='exp' min={mainCharacter.minExp} max={mainCharacter.maxExp} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-row bg-white px-5 py-5 border-b-2 border-[#ababab]'>
                        <div className='w-[60%]'>
                            <div className='flex flex-row justify-center'>
                                <div>
                                    <div className='my-2 rounded border-2 border-[#ababab] bg-[#bbbbbb] h-[50px] w-[50px]'>{equipment.weapon.name ? <Image src={`${equipment.weapon.img}`} alt={`${equipment.weapon.name}`} width='50' height='50' /> : <></>}</div>
                                    <div className='my-2 rounded border-2 border-[#ababab] bg-[#bbbbbb] h-[50px] w-[50px]'>{equipment.earrings.name ? <Image src={`${equipment.earrings.img}`} alt={`${equipment.earrings.name}`} width='50' height='50' /> : <></>}</div>
                                    <div className='my-2 rounded border-2 border-[#ababab] bg-[#bbbbbb] h-[50px] w-[50px]'>{equipment.necklace.name ? <Image src={`${equipment.necklace.img}`} alt={`${equipment.necklace.name}`} width='50' height='50' /> : <></>}</div>
                                    <div className='my-2 rounded border-2 border-[#ababab] bg-[#bbbbbb] h-[50px] w-[50px]'>{equipment.belt.name ? <Image src={`${equipment.belt.img}`} alt={`${equipment.belt.name}`} width='50' height='50' /> : <></>}</div>
                                </div>
                                <div className='mx-5'>
                                    <div className='my-2 h-[225px] w-[150px]' style={{pointerEvents: 'none'}}>
                                        {isEquipWeapon &&
                                            <Image src='https://cdn.discordapp.com/attachments/1162103656880033953/1162103739839152218/weapon.webp?ex=653ab872&is=65284372&hm=ff6015b009049e90638a93aa7a27e72e550f34748f623638fddc863340a8e3a5&' alt='char_img_weapon' className='absolute z-[10]' width='150' height='225'
                                                onAnimationIteration={() => {
                                                    if (isEquipWeapon) {
                                                    setAnimationEquipmentFrame(prev => (prev % 5) + 1);
                                                    }
                                                }}
                                            />
                                        }
                                        {isEquipHelmet &&
                                            <Image src='https://cdn.discordapp.com/attachments/1162103656880033953/1162103698487509153/helmet.webp?ex=653ab868&is=65284368&hm=cca5da1b8995a5ee4d5271ab18aa55a0248cea048eee25f9305e358272c221f9&' alt='char_img_helmet' className='absolute z-[9]' width='150' height='225'
                                                onAnimationIteration={() => {
                                                    if (isEquipHelmet) {
                                                    setAnimationEquipmentFrame(prev => (prev % 5) + 1);
                                                    }
                                                }}
                                            />
                                        }
                                        {isEquipChest &&
                                            <Image src='https://cdn.discordapp.com/attachments/1162103656880033953/1162103716841799791/chest.webp?ex=653ab86c&is=6528436c&hm=2cba979c9e30981909ef3601212a13d47c85bdd698d812981556111615eec159&' alt='char_img_chest' className='absolute z-[8]' width='150' height='225'
                                                onAnimationIteration={() => {
                                                    if (isEquipChest) {
                                                    setAnimationEquipmentFrame(prev => (prev % 5) + 1);
                                                    }
                                                }}
                                            />
                                        }
                                        {isEquipGloves &&
                                            <Image src='https://cdn.discordapp.com/attachments/1162103656880033953/1162103727642120324/gloves.webp?ex=653ab86f&is=6528436f&hm=7ff1165f1917f979837fec5eafaa053de172d9a4c149444d51572aeeb6add2bf&' alt='char_img_gloves' className='absolute z-[7]' width='150' height='225'
                                                onAnimationIteration={() => {
                                                    if (isEquipGloves) {
                                                    setAnimationEquipmentFrame(prev => (prev % 5) + 1);
                                                    }
                                                }}
                                            />
                                        }
                                        {isEquipBoots &&
                                            <Image src='https://cdn.discordapp.com/attachments/1162103656880033953/1162103732511703144/boots.webp?ex=653ab870&is=65284370&hm=95d4cfb251b6f4b15886a4486781740ed5f296e4594ea1eec46c22d7b775aa72&' alt='char_img_boots' className='absolute z-[6]' width='150' height='225'
                                                onAnimationIteration={() => {
                                                    if (isEquipBoots) {
                                                    setAnimationEquipmentFrame(prev => (prev % 5) + 1);
                                                    }
                                                }}
                                            />
                                        }
                                        <Image src='https://cdn.discordapp.com/attachments/1162098928137814137/1162099001852690442/character_base.webp?ex=653ab408&is=65283f08&hm=17d85d154486120e38b9344ac6eacb33e32bca316d8bccc04b0f9e3b8ef437e7&' alt='char_img' className='absolute z-[5]' width='150' height='225'
                                            onAnimationIteration={() => {
                                                if (isEquipWeapon || isEquipHelmet || isEquipChest || isEquipGloves || isEquipBoots) {
                                                setAnimationEquipmentFrame(prev => (prev % 5) + 1);
                                                }
                                            }}
                                        />
                                    </div>
                                    <button className='mx-1 bg-red-500' onClick={() => handleEquipmentChange('weapon')}>Wea</button>
                                    <button className='mx-1 bg-red-500' onClick={() => handleEquipmentChange('helmet')}>Hel</button>
                                    <button className='mx-1 bg-red-500' onClick={() => handleEquipmentChange('chest')}>Che</button>
                                    <button className='mx-1 bg-red-500' onClick={() => handleEquipmentChange('gloves')}>Glo</button>
                                    <button className='mx-1 bg-red-500' onClick={() => handleEquipmentChange('boots')}>Boo</button>
                                </div>
                                <div>
                                    <div className='my-2 rounded border-2 border-[#ababab] bg-[#bbbbbb] h-[50px] w-[50px]'>{equipment.helmet.name ? <Image src={`${equipment.helmet.img}`} alt={`${equipment.helmet.name}`} width='50' height='50' /> : <></>}</div>
                                    <div className='my-2 rounded border-2 border-[#ababab] bg-[#bbbbbb] h-[50px] w-[50px]'>{equipment.armor.name ? <Image src={`${equipment.armor.img}`} alt={`${equipment.armor.name}`} width='50' height='50' /> : <></>}</div>
                                    <div className='my-2 rounded border-2 border-[#ababab] bg-[#bbbbbb] h-[50px] w-[50px]'>{equipment.gloves.name ? <Image src={`${equipment.gloves.img}`} alt={`${equipment.gloves.name}`} width='50' height='50' /> : <></>}</div>
                                    <div className='my-2 rounded border-2 border-[#ababab] bg-[#bbbbbb] h-[50px] w-[50px]'>{equipment.boots.name ? <Image src={`${equipment.boots.img}`} alt={`${equipment.boots.name}`} width='50' height='50' /> : <></>}</div>
                                </div>
                            </div>
                            <div className='flex flex-row justify-center'>
                                <button className='btn-preset' style={{backgroundColor: presetSelected === 1 ? '#158fc7' : '#e3e3e3'}} onClick={() => onPressPreset(1)}>1</button>
                                <button className='btn-preset' style={{backgroundColor: presetSelected === 2 ? '#158fc7' : '#e3e3e3'}} onClick={() => onPressPreset(2)}>2</button>
                                <button className='btn-preset' style={{backgroundColor: presetSelected === 3 ? '#158fc7' : '#e3e3e3'}} onClick={() => onPressPreset(3)}>3</button>
                                <button className='btn-preset' style={{backgroundColor: presetSelected === 4 ? '#158fc7' : '#e3e3e3'}} onClick={() => onPressPreset(4)}>4</button>
                                <button className='btn-preset' style={{backgroundColor: presetSelected === 5 ? '#158fc7' : '#e3e3e3'}} onClick={() => onPressPreset(5)}>5</button>
                            </div>
                        </div>
                        <div className='w-[40%]'>
                            <div className='flex flex-row justify-center'>
                                <button className='btn-switch rounded-tl-lg rounded-bl-lg' style={{backgroundColor: statusSwitch === 1 ? '#158fc7' : '#e3e3e3'}} onClick={() => onPressStatusSwitch(1)}>{t('status_switch')}</button>
                                <button className='btn-switch rounded-tr-lg rounded-br-lg' style={{backgroundColor: statusSwitch === 2 ? '#158fc7' : '#e3e3e3'}} onClick={() => onPressStatusSwitch(2)}>{t('detail_switch')}</button>
                            </div>
                            {statusSwitch === 1 ? (
                                <>
                                    {viewStatus}
                                    <div className='flex flex-row justify-between'>
                                        <div>{t('point', {point: mainCharacterProfile.statusPoint - tempStatus.point})}</div>
                                        <button
                                            disabled={mainCharacterProfile.statusPoint > 0 && tempStatus.statusPoint > 0}
                                            className='w-[55px] justify-center bg-green-500 text-white'
                                            style={{display: tempStatus.point > 0 ? 'flex' : 'none'}}
                                            onClick={onPressSubmitStatus}
                                        >
                                            Apply
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {viewDetail}
                                </>
                            )}
                        </div>
                    </div>

                    <div className='bg-white p-5 border-b-2 border-[#ababab]'>
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <Inventory itemDrop={onItemDrop} />
                        </div>
                    </div>
                </div>

                <div className='w-[33%] flex-1 justify-center mx-5'>
                    <div className='bg-slate-500 text-center text-white font-bold py-2 rounded-tl-2xl rounded-tr-2xl'>
                        <h1>[ {t('title_adventure')} ]</h1>
                    </div>
                    <div className='flex flex-col bg-white p-5 border-b-2 border-[#ababab] items-center'>
                        {monster &&
                            <>
                                <div className='flex flex-col w-[100%] h-[220px] mb-2 items-center justify-center relative'>
                                    <div className='absolute z-10 text-center'>
                                        <div className='font-bold text-white text-xl'>{t('monster_level', {level: monster.level, name: monster.name, count: monsterCount})}</div>
                                        <div className='my-5 w-[120px] h-[120px]'>
                                            <Image src={`/monster_${monster.id}.webp`} alt='monster_img' className='mr-3' width='120' height='120' style={{ objectFit: 'cover', objectPosition: 'center center' }} />
                                        </div>
                                    </div>
                                    <Image
                                        src={`https://cdn.discordapp.com/attachments/1158274425150513204/1160509606842355723/bg.webp?ex=6534ebcb&is=652276cb&hm=b9acebfe9c9da72a192d496fadf624ec760382bd18d97239fc2366fbabaf90cd&`}
                                        alt='monster_bg_img'
                                        className='z-0'
                                        width='580'
                                        height='220'
                                        style={{ width: '100%', height: '100%' }}
                                    />
                                </div>
                                <div className='flex flex-row w-[100%] justify-end'>{monster.minHp}/{monster.maxHp} <HeartIcon className='h-6 w-6 ml-1 text-red-500' /></div>
                                <ProgressBar name='hp_monster' min={monster.minHp} max={monster.maxHp} />
                                <div className='mt-3'></div>
                                <ProgressBar name='time_monster' min={monsterTime} max={60} />
                                <div className='mt-5'>
                                    <button className='attack-button px-8 py-3 bg-orange-500' onClick={() => onPressAttack(monster.minHp, mainCharacter.damage)}>
                                        <div className='text-white font-medium'>
                                            {t('attack_button')}
                                        </div>
                                    </button>
                                </div>
                            </>
                        }
                    </div>
                    <div className='bg-white'>
                        <div>Stage</div>
                        <div className=''>

                        </div>
                    </div>
                </div>

                <div className='w-[33%] flex-1 justify-center mr-5'>
                    <div className='bg-slate-500 text-center text-white font-bold py-2 rounded-tl-2xl rounded-tr-2xl'>
                        <h1>[ {t('title_upgrade')} ]</h1>
                    </div>
                    <div className='bg-white p-5 border-b-2 border-[#ababab]'>
                        <div className='flex flex-row justify-center'>
                            <button className='btn-switch rounded-tl-lg rounded-bl-lg' style={{backgroundColor: upgradeSwitch === 1 ? '#158fc7' : '#e3e3e3'}} onClick={() => onPressUpgradeSwitch(1)}>{t('enchant_switch')}</button>
                            <button className='btn-switch' style={{backgroundColor: upgradeSwitch === 2 ? '#158fc7' : '#e3e3e3'}} onClick={() => onPressUpgradeSwitch(2)}>{t('skill_switch')}</button>
                            <button className='btn-switch' style={{backgroundColor: upgradeSwitch === 3 ? '#158fc7' : '#e3e3e3'}} onClick={() => onPressUpgradeSwitch(3)}>{t('passive_switch')}</button>
                            <button className='btn-switch rounded-tr-lg rounded-br-lg' style={{backgroundColor: upgradeSwitch === 4 ? '#158fc7' : '#e3e3e3'}} onClick={() => onPressUpgradeSwitch(4)}>{t('special_switch')}</button>
                        </div>
                        {upgradeSwitch === 1 &&
                            <div>Enchant</div>
                        }
                        {upgradeSwitch === 2 &&
                            <div>Skill</div>
                        }
                        {upgradeSwitch === 3 &&
                            <div>Passive</div>
                        }
                        {upgradeSwitch === 4 &&
                            <div className='mt-5'>
                                <div className=''>
                                    <button className='btn-switch rounded-tl-lg rounded-bl-lg' style={{backgroundColor: specialSwitch === 1 ? '#158fc7' : '#e3e3e3'}} onClick={() => onPressSpecialSwitch(1)}>{t('rune_switch')}</button>
                                    <button className='btn-switch rounded-tr-lg rounded-br-lg' style={{backgroundColor: specialSwitch === 2 ? '#158fc7' : '#e3e3e3'}} onClick={() => onPressSpecialSwitch(2)}>{t('relic_switch')}</button>
                                </div>
                                {specialSwitch === 1 ? (
                                    <Rune />
                                ) : (
                                    <Relic />
                                )}
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Game;