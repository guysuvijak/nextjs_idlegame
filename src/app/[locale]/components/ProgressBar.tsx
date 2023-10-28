'use client';
import React, { useState, useEffect, useCallback } from 'react';

const ProgressBar = ({ name, min, max }: any) => {
    const [ isFirstRender, setIsFirstRender ] = useState(true);
    const [ percentage, setPercentage ] = useState(name === 'exp' ? 0 : 100);
    
    const calculatePercentage = useCallback(() => {
        if(!isFirstRender) {
            if (name !== 'exp' && min <= 0) {
                setPercentage(100);
            } else {
                const calculatedPercentage = (min / max) * 100;
                setPercentage(calculatedPercentage);
            }
        } else {
            setIsFirstRender(false);
        }
    }, [name, min, max, isFirstRender]);

    useEffect(() => {
        calculatePercentage();
    }, [min, max, calculatePercentage]);
    
    const getProgressBarColor = (name: string) => {
        switch (name) {
            case 'hp':
            case 'hp_monster':
                return '#e3162c';
            case 'mp':
                return '#3971e5';
            case 'exp':
                return '#ffbc52';
            case 'time_monster':
                return '#8e8b83';
            default:
                return 'gray';
        }
    };

    return (
        <div className='progress-bar-container'>
            <div className={`${name === 'time_monster' ? 'progress-bar-time' : 'progress-bar'}`} style={{width: `${percentage}%`, backgroundColor: getProgressBarColor(name)}}>
                <div className='text-white text-xs mr-2'>{`${name === 'time_monster' ? `${min}s` : `${percentage.toFixed(0)}%`}`}</div>
            </div>
        </div>
    );
};

export default ProgressBar;