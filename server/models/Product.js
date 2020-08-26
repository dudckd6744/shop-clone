const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const productSchema = mongoose.Schema({

    writer:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    title:{
        type:String,
        maxlength:50
    },
    description:{
        type:String
    },
    price:{
        type:Number,
        default:0
    },
    images:{
        type:Array,
        default:[]
    },
    continents:{
        type:Number,
        default:1
    },
    sold:{
        type:Number,
        default:0
    },
    views:{
        type:Number,
        default:0
    }
},{timestamps: true})

productSchema.index({
    title:"text",
    description:"text"
}, {
    weights:{
        title:8,
        description:5
    }
})


const Product = mongoose.model('Product', productSchema);

module.exports = { Product }