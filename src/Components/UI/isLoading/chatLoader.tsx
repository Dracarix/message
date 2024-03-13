import './isloading.scss';

const ChatLoader = () => {
  return (
      <div className='chatInfo loading'>
        <div className="wrapper">
            <div className="circle"></div>
            <div className="line"></div>
        </div>      
      </div>
  );
};



const MessageLoader = () => {
  return (
    <div>
        <div className='messageContent-left '>

            <div className='block_mess loading1 '>
                <div className="wrapper">

                    <div className="line"></div>
                </div>
            </div>
        </div>
        <div className='messageContent-right '>

            <div className='block_mess loading1 '>
                <div className="wrapper">

                    <div className="line"></div>
                </div>
            </div>
        </div>
        <div className='messageContent-left '>

            <div className='block_mess loading2 '>
                <div className="wrapper">

                    <div className="line"></div>
                </div>
            </div>
        </div>

        <div className='messageContent-right '>

            <div className='block_mess loading2 '>
                <div className="wrapper">

                    <div className="line"></div>
                </div>
            </div>
        </div>

    </div>
  );
};


export { ChatLoader , MessageLoader};