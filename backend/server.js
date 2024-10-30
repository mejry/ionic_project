const express = require('express');
const connectDB = require('./config/db');
const routeruser=require("./routes/RoutesUser")
const categoryroute=require("./routes/CategoryRoute")
const commande=require("./routes/CommandeRoute")
const service=require("./routes/ServiceRoute")
const dotenv = require('dotenv');
const cors =require("cors")
dotenv.config();

const app = express();
app.use(express.json());
connectDB();
app.use(express.urlencoded({ extended: true }));

app.use(cors())
app.use("/user",routeruser)
app.use("/category",categoryroute)
app.use("/commande",commande)
app.use("/service",service)



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
