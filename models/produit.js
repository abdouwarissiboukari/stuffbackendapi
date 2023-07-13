module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'produit',
        {
            Code: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: {
                    msg: `Le code déjà utilisé.`
                },
                validate:{
                    notEmpty: {msg: 'Erreur: caractère vide on autorisé.'},
                    notNull: {msg: 'Erreur: propiété requises requise.'}
                  }
            },
            Designation: {
                type: DataTypes.STRING,
                allowNull: false,
                validate:{
                    notEmpty: {msg: 'Erreur: caractère vide on autorisé.'},
                    notNull: {msg: 'Erreur: propiété requises requise.'}
                  }
            },
            Famille: {
                type: DataTypes.STRING,
                allowNull: false,
                validate:{
                    notEmpty: {msg: 'Erreur: caractère vide on autorisé.'},
                    notNull: {msg: 'Erreur: propiété requises requise.'}
                  }
            },
            Forme: {
                type: DataTypes.STRING,
                allowNull: false,
                validate:{
                    notEmpty: {msg: 'Erreur: caractère vide on autorisé.'},
                    notNull: {msg: 'Erreur: propiété requises requise.'}
                  }
            },
            Emballage: {
                type: DataTypes.INTEGER,
                defaultValue: 0,                
            },
            Quantite: {
                type: DataTypes.INTEGER,
                defaultValue: 0, 
            },
            Seuil: {
                type: DataTypes.INTEGER,
                defaultValue: 0, 
            },
            QuantiteSortie: {
                type: DataTypes.INTEGER,
                defaultValue: 0, 
            },
            Prix: {
                type: DataTypes.DOUBLE,
                defaultValue: 0
            },
            Cout: {
                type: DataTypes.DOUBLE,
                defaultValue: 0
            },
            IsActif: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
                validate: {
                    notNull: { msg: `Erreur: propiété requises requise.` }
                }
            },
            IsDeleted: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,  
                validate: {
                    notNull: { msg: `Erreur: propiété requises requise.` }
                }
            },
            ImageUrl: {
                type: DataTypes.STRING,
                allowNull: false,
                validate:{
                    notNull: {msg: 'Erreur: propiété requises requise.'}
                  }
            },
            CodeAgence: {
                type: DataTypes.STRING,
                allowNull: false,
                validate:
                {
                    len: [0, 5],
                    notEmpty: { msg: `Erreur: caractère vide on autorisé.`},
                    notNull: { msg: `Le codeagence est requis`}
                }
            },
            UtilisateurId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    isInt: { msg: `Erreur: nombre entier autorisé.`},
                    notNull: { msg: `Erreur: propiété requises requise.` }
                }
            }
        },
        {
            timestamps: true,
            createdAt: 'created',
            upadatedAt: 'UpdateDate'
        }
    )
}