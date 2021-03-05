const mongoose = require('mongoose');

const DB_CONNECT = async () => {
      try {
        await mongoose.connect('mongodb+srv://agup5:p5@SOFIA.5wgac.mongodb.net/omdb?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
        console.log('DB Connection on...')
      } catch (e) {
          console.log(e);
          process.exit(1);
      }
}

module.exports = DB_CONNECT;