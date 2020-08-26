import React, { useEffect, useState } from 'react'
import { Icon, Col, Card, Row} from "antd";
import { continents,price } from "./Section/Data";
import Axios from 'axios';
import Meta from 'antd/lib/card/Meta';
import ImageSlider from "../../util/ImageSlider";
import CheckBox from "./Section/CheckBox";
import RadioBox from "./Section/RadioBox";
import Searches from "./Section/Searches";

function LandingPage() {

    const [Products, setProducts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState(0)
    const [SearchTerm, setSearchTerm] = useState("")
    const [Filters, setFilters] = useState({
        continents: [],
        pirce: []
    })

    useEffect(() => {

        var body ={
            skip:Skip,
            limit:Limit
        }
        getProducts(body)
        
    }, [])

    const getProducts =(body)=>{
        Axios.post('/api/product/products', body)
        .then(response=>{
            if(response.data.success){
                if(body.loadMore){
                    setProducts([...Products, ...response.data.product])
                }else{
                setProducts(response.data.product)
                }
                setPostSize(response.data.postSize)
            }else{
                alert("상품들을 가져오는데 실패하였습니다.")
            }
        })
    }

    const onLoadMore =()=>{
        var skip= Skip+Limit

        var body ={
            skip:skip,
            limit:Limit,
            loadMore:true
        }

        getProducts(body)
        setSkip(skip)

    }

    const renderCards = Products.map((item, i)=>{
        return <Col key={i} lg={6} md={8} xs={24}>
            <Card
            cover={<a href={`/product/${item._id}`}><ImageSlider images={item.images}/></a>}
            >
                <Meta
                    title={item.title}
                    description={`$${item.price}`}
                />
            </Card>
        </Col>
    })

    const showFilteredResults=(newcheck)=>{

        var body ={
            skip:0,
            limit:Limit,
            filters:newcheck
        }

        getProducts(body)
        setSkip(0)

    }

    const handlePrice=(value)=>{
        const data = price;
        var array =[];

        for(var key in data){
            if(data[key]._id === parseInt(value, 10)) {
                array = data[key].array;
            }
        }
        return array;
    }

    const handleFilters =(check, category)=>{

        const newFilters = {...Filters}

        newFilters[category] = check

        if(category==="price"){
            var priceValues = handlePrice(check)
            newFilters[category]=priceValues
        }

        showFilteredResults(newFilters)
        setFilters(newFilters)

    }

    const updateSeach=(newSearch)=>{
        var body ={
            skip:0,
            limit:Limit,
            filters:Filters,
            search:newSearch
        }
        setSkip(0)
        setSearchTerm(newSearch)
        getProducts(body)
        console.log(newSearch)

    }

    return (
        <div style={{ width:"75%", margin:"3rem auto"}}>
            <div style={{ textAlign:"center"}}>
                <h2>Let's Travel AnyWhere<Icon type="rocket"/></h2>
            </div>

            {/* Filter */}

             {/* checkBox */}
        <Row gutter={[16,16]}>
            <Col lg={12} xs={24}>
            <CheckBox list={continents} handleFilters={filters => handleFilters(filters, "continents")}/>
            </Col>
             {/* RadioBox */}
            <Col lg={12} xs={24}>
            <RadioBox list={price} handleFilters={filters => handleFilters(filters, "price")}/>
                </Col>
            </Row>

             {/* Search */}
            <div style={{display:"flex", justifyContent:"flex-end", margin:"1rem auto"}}>
                <Searches 
                refreshFunction={updateSeach}
                />
            </div>
            
            

            {/* Cards */}
            <Row gutter={[16, 16]}>
                {renderCards}
            </Row>
            <br />

            {PostSize >= Limit && 
            
            <div style={{display:"flex", justifyContent:"center"}}>
                <button onClick={onLoadMore} >더 보기</button>
            </div>
            
            }
            
        </div>
    )
}

export default LandingPage
