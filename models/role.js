module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'Role',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            libelle: {
                type: DataTypes.STRING,
                required: true,
                allowNull: false,
                unique: {
                    msg: 'Cet role existe déjà...'
                },
                validate: {
                    notEmpty: { msg: 'Le libellé ne peut pas contenir de caractère vide.' },
                    notNull: { msg: 'Le libellé est une propriété requise...'}
                }
            },
            isshow: {
                type: DataTypes.BOOLEAN,
                allowNull: false,     
                defaultValue: 1           
            },            
        },
        {
            timestamps: true,
            createdAt: 'created',
            updateAt: true,
            updateAt: 'updated'
        }
    )
}