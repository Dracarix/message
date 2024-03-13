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


const IsLoaderUsers = () => {
    return(

        <div className="loader_users">
            <div className="wrapper">
                <div className="circle"></div>
                <div className="line-1"></div>
                <div className="line-2"></div>

            </div>
        </div>
        )
}

export {IsLoadingBig, IsLoadingMini, IsLoaderUsers};