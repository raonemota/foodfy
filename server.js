const express = require('express')
const nunjucks = require('nunjucks')

const server = express()

const food = require('./data')

server.use(express.static('public'))

server.set("view engine", 'njk')

nunjucks.configure('views', {
    express: server,
    autoescape: false,
    noCache: true
})

server.get('/', function(req, res){
    return res.render("index")
})

server.get('/about', function(req, res){
    return res.render("about")
})

server.get('/revenue', function(req, res){
    return res.render("revenue", { food })
})

server.listen(5000, function(){
    console.log("Server is runnig")
})

