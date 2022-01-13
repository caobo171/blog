import React from 'react';
import { PF } from '../../Constants';

import './avatar.css'

const Avatar = ({src}) => {
    return (
        <div className='avatarWrap'>
            <img src={PF + src} className='avatar' alt="">
            </img>
        </div>
    )
}

export default Avatar;