require('dotenv').config()
const mongoose = require('mongoose');
const User = require('./schema.js');
const path=require('path');
const express = require('express');
const app=express();
app.use(express.static(__dirname));
mongoose.connect(process.env.MONGOURL).then(async (result) => {
    console.log('connected successfully');
    console.log(await User.countDocuments())

}).catch(err => console.log("connection failed", err));
const db = mongoose.connection
db.once('open', async () => {});

function paginationData(user) {
    return async function (req, res, next) {
        try {
            let totaldocumentCount = await user.countDocuments();
            const page = parseInt(req.query.page)
            const limit = parseInt(req.query.limit)
            const startvalue = (page - 1) * limit
            const endValue = page * limit
            let results = {};
            if (endValue < totaldocumentCount) {
                results.next = {
                    page: page + 1,
                    limit
                }
            }
            if (startvalue > 0) {
                results.previous = {
                    page: page - 1,
                    limit
                }
            }
            results.results = await user.find({}).limit(limit).skip(startvalue);
            results.totalSize=totaldocumentCount;
            res.paginationResults = results;
            next();
        } catch (e) {
            return res.status(500).json({message: e.message})
        }
    }
}
app.get('/',function(req,res){
    console.log("dirname",__dirname)
    res.sendFile(path.join(__dirname+'/index.html'));
  });

app.get('/users', paginationData(User), (req, res) => {
    res.status(200).json(res.paginationResults);
});

app.listen(3000, () => {
    console.log("Port is listening to 3000")
});
