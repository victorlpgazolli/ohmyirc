import React, { memo } from 'react'
import { useWindowSize } from '../../../hooks/useWindowSize'


const MessageOfTheDay = ({
    motd
}) => {
    const { height } = useWindowSize({ watch: true })

    return (
        <>
            <h1>Message Of The Day</h1>
            <pre
                style={{
                    paddingTop: "20px",
                    // overflow: "scroll",
                    overflowY: "scroll",
                    maxHeight: height - 150
                }}
            >
                {motd}
            </pre>
        </>
    )
}

export default memo(MessageOfTheDay)
