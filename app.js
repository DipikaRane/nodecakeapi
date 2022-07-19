var express=require('express');
var app = express();
var dotenv=require('dotenv');
var mongo=require('mongodb');
var MongoClient=mongo.MongoClient;
dotenv.config();
const mongoUrl='mongodb+srv://dipikarane:dipikarane@cluster0.kpl8h.mongodb.net/?retryWrites=true&w=majority';
var cors=require('cors');
const bodyParser=require('body-parser');

var port = process.env.PORT || 8425
var db;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());

//first default route
app.get('/',(req,res)=>{
    res.send("This is The Cake Studio")
})
app.get('/cakes',(req,res)=>{
    db.collection('cakedetails').find().toArray((err,result)=>{
        if(err) throw err
        res.send(result);
    })
})
app.get('/cakes/:id',(req,res)=>{
    var id=parseInt(req.params.id);
    // console.log(id);
    // res.send('ok')
    db.collection('cakedetails').find({_id:id}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})
app.get('/order',(req,res)=>{
    db.collection('orders').find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})
app.post('/placeorder',(req,res)=>{
    // console.log(req.body);
    // res.send('ok')
    db.collection('orders').insert(req.body,(err,result)=>{
        if(err) throw err;
        res.send("Order placed");
    })
})
app.delete('/deleteOrder',(req,res)=>{
    db.collection('orders').remove({},(err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})

app.delete('/deleteOrder/:id',(req,res)=>{
    var id=Number(req.params.id)
    db.collection('orders').remove({_id:id},(err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})
app.put('/updateStatus/:id',(req,res)=>{
    var id=Number(req.params.id)
    var status=req.body.status?req.body.status:"Booked"
    db.collection('orders').updateOne(
        {id:id},
        {
            $set:{
                "date":req.body.date,
                "Bank":req.body.Bank,
                "bank_status":req.body.bank_status,
                "status":status
            }
        }
    )
    res.send("Data updated")
})
//connect with mongodb 
MongoClient.connect(mongoUrl,(err,client)=>{
    if(err) console.log("Error while Connection");
    db=client.db('cake');
    app.listen(port,()=>{
        console.log(`listening on port ${port}`)
    })
})