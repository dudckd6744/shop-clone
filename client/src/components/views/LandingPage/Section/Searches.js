import React, { useState } from 'react'
import { Input } from 'antd';

const { Search } = Input;

function Searches(props) {
    const [SearchTerm, setSearchTerm] = useState("")

    const searchChange =(e)=>{
        setSearchTerm(e.currentTarget.value)
        props.refreshFunction(e.currentTarget.value)
    }

    return (
        <div>
        <Search
            placeholder="input search text"
            onChange={searchChange}
            style={{ width: 200 }}
            value={SearchTerm}
        />
        </div>
    )
}

export default Searches
