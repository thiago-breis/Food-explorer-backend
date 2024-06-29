require ("dotenv/config");
const migrations = require("./database/sqlite/migrations");
const uploadConfig = require("./configs/upload");
const AppError = require('./utils/appError');
const express = require("express");
const cors = require("cors");

const routes = require("./routes");

// const { request } = require('./routes/users.routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));
app.use(routes);

//Faz a conexão com o banco, e executa a migration
migrations();

//tratamento de excessões
app.use((error, request, response, next) => {
  //verificar se é erro do lado do Cliente
  console.log(error);

  if(error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message
    });
  }

  return response.status(500).json({
    status: "error",
    message: "Internal server error"
  })

})

const PORT = process.env.PORT || 3355
app.listen(PORT, console.log(`Server is running on Port ${PORT}`));