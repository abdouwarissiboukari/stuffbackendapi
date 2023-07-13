const { Sequelize, DataTypes, Op } = require('sequelize')
const RoleModel = require('../models/role')
const UtilisateurModel = require('../models/utilisateur')
const ProduitModel = require('../models/produit')
const TokenModel = require('../models/token')
const bcrypt = require('bcrypt')

let sequelize

if(process.env.NODE_ENV === 'production'){
  sequelize = new Sequelize(
    'db_a64746_stuffbe',
    'a64746_stuffbe',
    'stuffbea64746',
    {
      host: 'mysql5048.site4now.net',
      dialect: 'mysql',
      dialectOptions: {
        timezone: '+00:00'
      },
      logging: false,
      timezone: '+00:00'
    }
  )
}else{
  sequelize = new Sequelize(
    'db_a64746_stuffbe',
    'a64746_stuffbe',
    'stuffbea64746',
    {
      host: 'mysql5048.site4now.net',
      dialect: 'mysql',
      dialectOptions: {
        timezone: '+00:00'
      },
      logging: false,
      timezone: '+00:00'
    }
  )
}
  
const Role = RoleModel(sequelize, DataTypes)
const Utilisateur = UtilisateurModel(sequelize, DataTypes)
const Produit = ProduitModel(sequelize, DataTypes)
const Token = TokenModel(sequelize, DataTypes)

Role.hasMany(
  Utilisateur, 
  {
    foreignKey: 'RoleId'
  }
)
Utilisateur.belongsTo(Role)

Utilisateur.hasMany(
  Produit, 
  {
    foreignKey: 'UtilisateurId'
  }
)
Produit.belongsTo(Utilisateur)
  
const initDb = () => {
  
  return sequelize.sync({ alter: true}).then(_ => {  
    let roleId

    Role.findOne({ where: { Libelle: 'owner' } })
    .then(role => {

      if(!role){
        Role.create({
          libelle: 'owner'
        })
        .then(role => { 
            roleId = role.toJSON()            
            console.log(roleId)

            
            Utilisateur.findAndCountAll({ where: {RoleId : roleId.id } ,limit: 1})
            .then(({count, rows}) => {
                if(count === 0){
                  bcrypt.hash('rush7', 10)
                  .then(hash => {
                    Utilisateur.create({
                      Login: 'x7log',
                      Password: hash,
                      Staff: 'Top User',
                      CodeAgence: 'ST01',
                      RoleId: roleId.id
                    })
                    .then(user => console.log(user.toJSON()))
                  })
                }
            })
            
          }
        )
      }
    })


     

    console.log('La base de donnée a bien été initialisée !')
  })
}
  
module.exports = { 
  initDb, Role, Utilisateur, Produit, Token, sequelize, Op
}