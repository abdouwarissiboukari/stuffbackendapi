module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'Utilisateur',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            Login: {
                type: DataTypes.STRING,
                allowNull: false,
                unique : { msg: `Login déjà pris.`},
                validate:
                {
                    notEmpty: { msg: `Erreur: caractère vide on autorisé.`},
                    notNull: { msg: `Le login est requis`}
                }
            },
            Email: {
                type: DataTypes.STRING,
                unique: `Le mail existe déjà.`,
                allowNull: false,
                validate: {
                    notEmpty: { msg: `Erreur: caractère vide on autorisé.`},
                    notNull: { msg: `Le mail est requis.`},
                    isEmail: { msg: `Erreur mail non valide`}
                }
            },
            Password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate:
                {
                    notEmpty: { msg: `Le mot de passe doit contenir au moins six caractères.`},
                    notNull: { msg: `Le mot de passe est obligatoire.`}
                }
            },
            Statut: {
                type: DataTypes.INTEGER,
                defaultValue: 1,
                validate: {
                    isInt: {msg: 'Utilisez uniquement les nombres entiers comme valeur.'},                    
                }
            },
            Etat: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                validate: {
                    isInt: {msg: 'Utilisez uniquement les nombres entiers comme valeur.'},  
                    min: {
                        args: [0],
                        msg: 'La valeur doit être comprise entre 0 et 1.'
                      },
                    max: {
                        args: [1],
                        msg: 'La valeur doit être comprise entre 0 et 1.'
                      }                   
                }
            },
            Staff: {
                type: DataTypes.STRING,
                allowNull: false,
                validate:
                {
                    notEmpty: { msg: `Erreur: caractère vide on autorisé.`},
                    notNull: { msg: `Le staff est requis`}
                }
            },
            IsDeleted: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                validate: {
                    isInt: {msg: 'Utilisez uniquement les nombres entiers comme valeur.'}, 
                    min: {
                        args: [0],
                        msg: 'La valeur doit être comprise entre 0 et 1.'
                      },
                    max: {
                        args: [1],
                        msg: 'La valeur doit être comprise entre 0 et 1.'
                      }                   
                }
            },
            CodeAgence: {
                type: DataTypes.STRING,
                allowNull: false,
                validate:
                {
                    len: [0, 5],
                    notEmpty: { msg: `Erreur: caractère vide on autorisé.`},
                    notNull: { msg: `Erreur: propiété requises requise.`}
                }
            },
            Level: {
                type: DataTypes.INTEGER,
                defaultValue: 1,
                validate: {
                    isInt: {msg: 'Erreur: nombre entier autorisé.'}                 
                }
            },
            RoleId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    isInt: {msg: 'Erreur: nombre entier autorisé.'}   ,
                    notNull: { msg: `Erreur: propiété requises requise.`}              
                }
            },
        },
        {
            timestamps: true,
            createdAt: 'Date',
            updateAt: true,
            updateAt: 'Updated'
        }
    )
}