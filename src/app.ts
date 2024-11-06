import express from "express"
import cors from "cors"
import AppDataSource from "./config/config_database";
import router from "./routes";
import path from "path";



const app = express();
const PORT = process.env.PORT || 3333; 


AppDataSource.initialize()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida!');
  })
  .catch((error) => console.log('Erro ao conectar ao banco de dados:', error));


const corsOptions = {
  methods: ["GET", "POST", "PUT", "DELETE"],
  exposedHeaders: ["Authorization"],
  allowedHeaders: ["Content-Type", "Authorization"], 

}

app.use(cors(corsOptions))
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(router)


app.listen(PORT, () => 
    console.log(`Server is running in http://localhost:${PORT}`)
)