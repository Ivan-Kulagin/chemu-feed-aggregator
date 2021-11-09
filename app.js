const express = require('express')
const path = require('path')
const app = express()
const {CHEM_LIST, PHARMA_LIST} = require('./parser')


app.get('/api/feed', (req, res) => {
    let FEED = {CHEM_LIST, PHARMA_LIST}
    let compare = function(a,b){
        return new Date(b.date) - new Date(a.date);
    }

    FEED.CHEM_LIST.sort(compare);
    FEED.PHARMA_LIST.sort(compare);

    res.status(200).json(FEED)
})

app.use(express.static(path.resolve(__dirname, 'client')))

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'index.html'))
})

app.listen(8080, () =>
    console.log('Server has been started on port 8080...'))

