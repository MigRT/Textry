const db = require("./db")

const Images = db.sequelize.define('images', {
    img:{
        type: db.Sequelize.STRING
    }
})

module.exports = Images