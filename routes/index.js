module.exports = app => {
  app.use("/nodes", require("./nodes") )
  app.use("/edges", require("./edges") )
}
