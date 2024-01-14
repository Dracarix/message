import React from 'react';
import './isloading.scss';

const IsLoadingBig = () => {
    return(
        <div className="container">
            <div className="top">
                <div className="square">
                <div className="square">
                    <div className="square">
                    <div className="square">
                        <div className="square"><div className="square">
                        </div></div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            <div className="bottom">
                <div className="square">
                <div className="square">
                    <div className="square">
                    <div className="square">
                        <div className="square"><div className="square">
                        </div></div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            <div className="left">
                <div className="square">
                <div className="square">
                    <div className="square">
                    <div className="square">
                        <div className="square"><div className="square">
                        </div></div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            <div className="right">
                <div className="square">
                <div className="square">
                    <div className="square">
                    <div className="square">
                        <div className="square"><div className="square">
                        </div></div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
};


const IsLoadingMini = () => {
    
  return <div className="loader"></div>
};

export {IsLoadingBig, IsLoadingMini};