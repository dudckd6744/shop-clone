import React, { useState } from 'react'
import { Collapse,Checkbox } from 'antd';

const { Panel } = Collapse;

function CheckBox(props) {
    const [Checked, setChecked] = useState([])

    const handleToggle=(item)=>{
        const currentIndex = Checked.indexOf(item)

        const newChecked = [...Checked]

        if(currentIndex === -1){
            newChecked.push(item)
        }else{
            newChecked.splice(currentIndex, 1)
        }

        setChecked(newChecked)
        props.handleFilters(newChecked)
        console.log(Checked)
    }

    const renderCheckBoxLists =()=> props.list && props.list.map((item, i)=> (
        <React.Fragment key={i}>
        <Checkbox 
        onChange={()=>handleToggle(item._id)}
        checked={Checked.indexOf(item._id)=== -1 ? false : true}
        />
        <span>{item.name}</span>
        </React.Fragment>
    ))
    

    return (
        <div>
            <Collapse defaultActiveKey={['1']}>
                <Panel header="Continents" key="0">
                    {renderCheckBoxLists()}
                </Panel>
            </Collapse>
        </div>
    )
}

export default CheckBox
