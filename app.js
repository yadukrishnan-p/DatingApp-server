const express = require ('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const connectDatabase = require('./config/DB')

dotenv.config({ path: path.join(__dirname, 'config', '.env') })

const app = express();
app.use(express.json());
app.use(cors());


connectDatabase();


const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);



app.get('/', (req, res) => {
    res.send(`<h1>Hello World</h1>`)
})



const port = process.env.PORT  || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));