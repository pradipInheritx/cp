import React from 'react'
import Countdown from 'react-countdown';


const CountDown = ({activeTime}:{activeTime:number}) => {
    return (
        <Countdown date={Date.now() + activeTime}
            renderer={({ hours, minutes, seconds, completed }) => {
                // console.log("Countdown Renderer - Hours:", hours, "Minutes:", minutes, "Seconds:", seconds, "Completed:", completed);
                return (
                    <span className="text-uppercase" style={{
                        color: '#6352e8', fontSize: '20px', fontWeight: 100, lineHeight: "10%", position: "absolute",
                        left: "42%",
                        top: "-25px",
                    }}>
                        {hours < 1 ? null : `${hours} :`}
                        {minutes < 10 ? `0${minutes}` : minutes}:

                        {seconds < 10 ? `0${seconds}` : seconds}
                    </span>
                );
            }}
        />
    )
}

export default React.memo(CountDown);