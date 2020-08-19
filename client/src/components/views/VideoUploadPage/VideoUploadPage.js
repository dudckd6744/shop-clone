import React, { useState } from 'react'
import { Typography, Button, Form, Input, message} from "antd";
import FileUpload from "../../util/FileUpload";
import { useSelector } from 'react-redux';
import Axios from 'axios';

const { Title } = Typography;
const { TextArea} = Input;

const Continents = [
    {key:1, value:"Africa"},
    {key:2, value:"Europe"},
    {key:3, value:"Asia"},
    {key:4, value:"North America"},
    {key:5, value:"South America"},
    {key:6, value:"Autralia"},
    {key:7, value:"Antarctica"}
]

function VideoUploadPage(props) {
    const user = useSelector(state => state.user)
    const [Titles, setTitles] = useState("")
    const [Description, setDescription] = useState("")
    const [Price, setPrice] = useState(0)
    const [Continent, setContinent] = useState(0)
    const [Images, setImages] = useState([])

    const onTitle=(e)=>{
        setTitles(e.currentTarget.value)
    }
    const onDescription=(e)=>{
        setDescription(e.currentTarget.value)
    }
    const onPrice=(e)=>{
        setPrice(e.currentTarget.value)
    }
    const onContinents=(e)=>{
        setContinent(e.currentTarget.value)
    }
    const updateImages=(newImages)=>{
        setImages(newImages)
    }
    const onSubmits=(e)=>{
        e.preventDefault();
        if(!Titles || !Description || !Price || !Images){
            return alert("모든 값을 넣어주셔야 됩니다!!")
        }
        var body={
            writer:user.userData._id,
            title:Titles,
            description:Description,
            price:Price,
            continents:Continent,
            images:Images
        }

        Axios.post('/api/product',body)
        .then(response=>{
            if(response.data.success){
                console.log(response.data)
                message.success("상품 업로드에 성공하셨습니다!!")
                setTimeout(() => {
                    props.history.push('/')
                }, 3000);
            }else{
                alert("상품업로드에 실패하였습니다.")
            }
        })
    }

    return (
        <div style={{ maxWidth:"700px", margin:"2rem auto"}}>
            <div style={{textAlign:"center", marginBottom:"2rem"}}>
                <Title level={2}>여행 상품 업로드</Title>
            </div>

            <Form onSubmit={onSubmits}>

                {/* Dropzone */}
                <FileUpload refreshFunction={updateImages} />

                <br />
                <br />
                <label>이름</label>
                <Input value={Titles} onChange={onTitle} />
                <br />
                <br />
                <label>설명</label>
                <TextArea value={Description} onChange={onDescription} />
                <br />
                <br />
                <label>가격</label>
                <Input type="number" value={Price} onChange={onPrice} />
                <br />
                <br />
                <select value={Continent} onChange={onContinents}>
                    {Continents.map(item => (
                        <option key={item.key} value={item.key}>{item.value}</option>
                    ))}
                </select>
                <br />
                <br />
                <Button onClick={onSubmits}>
                    확인
                </Button>
            </Form>
            
        </div>
    )
}

export default VideoUploadPage
