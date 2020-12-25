const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')

const app= express()
const uri = "mongodb+srv://admin:akshit@cluster0.li2jo.mongodb.net/url_Shortner?retryWrites=true&w=majority";
mongoose.connect(uri, {
    useNewUrlParser : true,
    useUnifiedTopology : true
   
    
}, console.log("Connection"));
mongoose.connection.on('connected', () => console.log("connected"))

app.set('view engine','ejs')
app.use(express.urlencoded({ extended: false}))

app.get('/', async (req,res) => {
    const shortUrls =  await ShortUrl.find();
    res.render('index', { shortUrls: shortUrls})

})

app.post('/shortUrls',async (req,res) => {
    await ShortUrl.create({ full: req.body.fullUrl })
    
        res.redirect('/') 
})
app.get('/:shortUrl',async (req,res) => {
    const shortUrl = await ShortUrl.findOne({short: req.params.shortUrl})
    if ( shortUrl == null) return res.sendStatus(404)

    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
})
app.listen(process.env.PORT || 3000)