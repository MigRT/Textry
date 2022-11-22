const db = require("./db")

const Cadastro = db.sequelize.define('users', {
    email:{
        type: db.Sequelize.STRING
    },
    name: {
        type: db.Sequelize.STRING
    },
    password: {
        type: db.Sequelize.STRING
    }
})

module.exports = Cadastro