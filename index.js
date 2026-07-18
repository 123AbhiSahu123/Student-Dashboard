import express from 'express';
import sequelize from './config/db.js'; 
import { User, Data } from './models/stumodels.js';
import stuRoutes from './routes/sturoutes.js'
import cors from "cors";

const app = express();
app.use(cors({
     origin: ["http://localhost:5173", "https://student-frontend-alpha-lyart.vercel.app/"],
     credentials: true      
}));
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use('/api', stuRoutes);

app.get('/health', (req, res) => {
     res.send("Good ok")
})

const startServer = async () => {
   try {
    // Yahan actual mein connection test ho raha hai
        await sequelize.authenticate()
        console.log('Database Connected!')

        // Tables sync karein
        await sequelize.sync({alter:true})
       

        app.listen(PORT, () => console.log(`Server running on ${PORT} (PostgresSQL)`));
   } catch (err) {
        console.log("Database Not Connected!", err);
        process.exit(1);
   }
}
startServer();
