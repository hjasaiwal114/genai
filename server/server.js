import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import userRouter from './routes/userRoutes.js'
import imageRouter from './routes/imageRoutes.js'

const PORT = process.env.PORT || 4000
const app = express()

app.use(express.json())
const allowedOrigins = [
  'https://imagify-ai-saasl.vercel.app',
  'http://localhost:5173',               
  'http://localhost:3000',
  'https://genai-og.vercel.app'                
];

app.use(cors({
  origin: 'https://genai-og.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

await connectDB()


app.use('/api/user', userRouter)
app.use('/api/image', imageRouter)
app.get('/', (req, res) => res.send("API Working"))

app.listen(PORT, () => console.log('Server running on port ' + PORT));