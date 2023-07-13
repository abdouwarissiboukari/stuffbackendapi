module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'token',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        required: true,
        validation: {
          isInt: { msg: `Erreur: seuls les entiers sont autorisés.`},
          notNull: { msqg: `Null non autorisé.`}
        }
      },
      Token: {
        type: DataTypes.STRING,      
      },
      Code: {
        type: DataTypes.STRING,
      },
      ExpiresIn: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      timestamps: true,
      createdAt: 'Created'
    }
  )
}