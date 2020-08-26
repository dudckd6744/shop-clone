const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { Product } = require("../models/Product")
const async = require("async");

const { auth } = require("../middleware/auth");
const {Payment} = require('../models/Payment');

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
        cart:req.user.cart,
        history:req.user.history
    });
});

router.post("/register", (req, res) => {

    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});

router.post("/addToCart", auth, (req, res) => {

    User.findOne({_id : req.user._id},
        (err, userInfo)=> {

            var duplicate = false;

            userInfo.cart.forEach((item)=>{
                if(item.id ===  req.body.productId){
                    duplicate = true;
                }
            })

            if(duplicate){
                User.findOneAndUpdate(
                    {_id: req.user._id, "cart.id": req.body.productId},
                    {$inc: {"cart.$.quantity":1}},
                    {new: true},
                    (err, userInfo)=>{
                        if(err) res.status(400).json({ success:false, err})
                        res.status(200).send(userInfo.cart)
                    }
                )
            }else{
                User.findOneAndUpdate(
                    {_id:req.user._id},
                    {
                        $push:{
                            cart:{
                                id:req.body.productId,
                                quantity:1,
                                date:Date.now()
                            }
                        }
                    },
                    {new:true},
                    (err, userInfo)=>{
                        if(err) res.status(400).json({ success:false, err})
                        res.status(200).send(userInfo.cart)                   
                    }
                )
            }


        })
    
});


router.post("/removeFromCart", auth, (req, res) => {
    
    User.findOneAndUpdate(
        {_id:req.user._id},
        {
            "$pull":
            {"cart":{"id":req.body.id}}
        },
        {new:true},
        (err,userInfo)=>{
            var cart = userInfo.cart
            var array = cart.map(item =>{
                return item.id
            })

            Product.find({_id: {$in : array}})
            .populate("writer")
            .exec((err,productInfo)=>{
                return res.status(200).json({
                    productInfo,
                    cart
                })
            })
        }
    )
});

router.post("/SuccessBy", auth, (req, res) => {

    var history=[];
    var transactionData=[];

    req.body.cartD.forEach((item)=>{
        history.push({
            dateofPurchase: Date.now(),
            name:item.title,
            id: item._id,
            price:item.price,
            quantity:item.quantity,
            paymentId: req.body.paymentData.paymentId
        })
    })

    transactionData.user={
        id:req.user._id,
        name:req.user.name,
        email:req.user.email
    }
    transactionData.data= req.body.paymentData
    transactionData.product= history

    User.findOneAndUpdate(
        {_id:req.user._id},
        {$push:{history:history}, $set:{cart:[]}},
        {new: true},
        (err, user)=> {
            if(err) return res.status(400).json({success:false, err})

            const payment = new Payment(transactionData)
            payment.save((err, doc)=>{
                if(err) return res.status(400).json({success:false, err})

                var products = [];
                doc.product.forEach(item =>{
                    products.push({ id : item.id,  quantity : item.quantity})
                })
                async.eachSeries(products,(item, cb)=>{
                    Product.update(
                        {_id:item.id},
                        {
                            $inc:{
                                "sold":item.quantity
                            }
                        },
                        {new:false},
                        cb
                    )
                },(err)=>{
                    if(err) return res.status(400).json({success:false, err})
                    res.status(200).json({
                        success:true,  cart: user.cart, cartD:[]
                    })
                }
                )
            })
        }
    )

    
});



module.exports = router;
