import React, { useState } from 'react'
import { Collapse, Radio } from "antd";

const { Panel} = Collapse;

function RadioBox(props) {

    const [Radios, setRadios] = useState(0)

    const renderRadioBox=()=>props.list && props.list.map((item, i) =>(
        <Radio key={i} value={item._id}>{item.name}</Radio>
    ))

    const onRadio=(e)=>{
        setRadios(e.target.value)
        props.handleFilters(e.target.value)
    }
    console.log(Radios)

    return (
        <div>
            <Collapse defaultActiveKey={['1']}>
                <Panel header="Price" key="0" >
                    <Radio.Group onChange={onRadio} value={Radios}>
                        {renderRadioBox()}
                    </Radio.Group>
                </Panel>
            </Collapse>
            
        </div>
    )
}

export default RadioBox
