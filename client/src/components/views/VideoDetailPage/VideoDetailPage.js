import React, { useState, useEffect } from 'react'
import Axios from "axios";
import ProductImage from "./Sections/ProductImage";
import ProductInfo from"./Sections/ProductInfo";
import { Row, Col } from "antd"
function VideoDetailPage(props) {

    const productId = props.match.params.videoId
    const [Product, setProduct] = useState({})

    useEffect(() => {

        var body={
            id : productId,
            type:"single"
        }


        Axios.post('/api/product/getProduct' ,body)
        .then(response=>{
                console.log(response.data[0])
                setProduct(response.data[0])
        })
        .catch(err => alert(err))

        
    }, [])
    return (
        <div style={{width:"100%" ,margin:"3rem 4rem"}}>
            <div style={{display:"flex", justifyContent:"center"}}>
            <h1>-{Product.title}-</h1>
            </div>
        <br />
        <Row gutter={[16,16]}>
            <Col lg={12} xs={24}>
            {/* // productImage */}
            <ProductImage detail={Product}/>
            </Col>
            {/* // productInfo  */}
            <Col lg={12} xs={24}>
            <ProductInfo detail={Product}/>
            </Col>
        </Row>
        
        </div>

    )
}

export default VideoDetailPage
