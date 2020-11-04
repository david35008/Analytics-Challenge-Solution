import React from 'react';
import './Loading.css';

const Loading: React.FC = () => {

    return (
        <div style={{ backgroundColor: 'transparent' }} className="loaderContainer">
            <div className="loader" />
        </div>
    );
}

export default Loading;
