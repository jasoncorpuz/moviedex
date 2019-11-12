require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const MOVIES = require('./movies')
const cors = require('cors')
const helmet = require ('helmet')

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

console.log(process.env.API_TOKEN)

app.use(function validateBearerToken(req,res,next) {
    
    const authToken = req.get('Authorization')
    const apiToken = process.env.API_TOKEN

    if(!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request'})
    }
    next() //required or timeout
})

function handleGetMovies(req,res) {
    let response = MOVIES
    //params = genre, country, avg_vote

    if(req.query.genre) {
        response = response.filter(movie => //no curlies
            movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
        )
    }

    if(req.query.country) {
        response = response.filter(movie => //no curlies
            movie.country.toLowerCase().includes(req.query.country.toLowerCase())
        )
    }

    if(req.query.avg_vote) {
        response = response.filter(movie => 
           Number(movie.avg_vote) >= req.query.avg_vote
        )
    }

    if(response.length === 0) {
        response = 'Sorry, no results for that. Try again?'
    }

    res.json(response) // have this or risk a timeout
}

app.get('/movies', handleGetMovies)

const PORT = 8000

app.listen(PORT, () => {
    console.log(`Server listening at ${PORT}`)
})