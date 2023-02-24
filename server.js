const app = require("./app")
require('./db').connectToMongoDB() // Connect to MongoDB
require('dotenv').config()
 
// app.get('/', (req, res) => {
//     res.send('Welcome to the Pizza API, Log in or Sign up to access your orders');
// })

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})