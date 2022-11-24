const db = require("./db")

const Images = db.sequelize.define('images', {
    img:{
        type: db.Sequelize.STRING
    },
    idUser:{
        type: db.Sequelize.INTEGER
    }
})

module.exports = Images