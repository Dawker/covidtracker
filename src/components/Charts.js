import React from 'react'
import "../components/Charts.css"
import InfoBox from './infoBox'


export const Charts = () => {
    return (
        <div className="charts__status">
            <InfoBox title="Coronavirus Cases" cases={10000} total={3000} />
            <InfoBox title="Recovered" cases={10000} total={3000} />
            <InfoBox title="Deaths" cases={10000} total={3000} />
        </div>
    )
}
