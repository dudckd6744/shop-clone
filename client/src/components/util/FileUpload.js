import React, { useState } from 'react'
import Dropzone from 'react-dropzone'
import { Icon } from "antd"
import Axios from 'axios';

function FileUpload(props) {

    const [Images, setImages] = useState([])


    const onDrop =(files)=>{


        var formData = new FormData();
        const config ={
            header:{'content-type':'multipart/form-data'}
        }
        formData.append('file',files[0])
        console.log(files)

        Axios.post('/api/product/image', formData, config)
        .then(response=>{
            if(response.data.success){
                console.log(response.data)
                setImages([...Images,response.data.filePath])
                props.refreshFunction([...Images,response.data.filePath])
            }else{
                alert('file을 저장하는데 실패하였습니다.')
            }
        })
    }

    const onDelet=(image)=>{
        const currentIndex = Images.indexOf(image)

        var newImages = [...Images]
        newImages.splice(currentIndex,1)

        setImages(newImages)
        props.refreshFunction(newImages)
    }

    return (
        <div style={{display:"flex", justifyContent:"space-between"}}>
            <Dropzone
                onDrop={onDrop} >
                {({getRootProps, getInputProps})=> (
                    <div
                    style={{ width:300, height:240, border:"1px solid lightgray",
                display:"flex", alignItems:"center", justifyContent:"center"}}
                {...getRootProps()}>
                    <input {...getInputProps()}/>
                    <Icon type="plus" style={{fontSize:"3rem"}}/>
                </div>
                )}
            </Dropzone>
            <div style={{ display:"flex", width:"350px", height:"240px", overflowX:"scroll"}}>
                {Images.map((image, i)=>(
                    <div onClick={()=>onDelet(image)} key={i}>
                    <img style={{ minWidth:"300px", width:"300px", height:"240px"}}
                    src={`http://localhost:5000/${image}`}
                    />
                </div>
                ))}
            </div>
        </div>
    )
}

export default FileUpload
