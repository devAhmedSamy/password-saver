const mongoose = require("mongoose")
function connect(port, app) {
  console.log("connecting...");
  mongoose
    .connect(
      "mongodb+srv://ahmed:ahmed@cluster0.qrye7.mongodb.net/password_app?retryWrites=true&w=majority"
    )
    .then(() => {
      app.listen(port, () => {
        console.log(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  example app listening at http://localhost:${port}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);
      });
    })
    .catch((err) => {
      console.log(`===================================
  Error on Connection with DataBase
===================================
  ${err}
===================================`);
    });
}
module.exports = connect