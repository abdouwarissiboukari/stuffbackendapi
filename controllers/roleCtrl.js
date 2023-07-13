const {Role} = require('../databases/sequelize');
const {Utilisateur} = require('../databases/sequelize');
const { Op } = require('sequelize')

exports.createRole = (req, res, next) => {
    const role = new Role({
        ...req.body
    });
    role.save()
    .then((role) => { 
        res.status(201).json({ role }); 
    })
    .catch(error => {
        res.status(400).json({ error });
    });
};

exports.getOneRole = (req, res, next) => {
    Role.findByPk(req.params.id)
    .then((role) => {
        res.status(200).json({ role });
    }).catch((error) => {
        res.status(404).json({ error });
    });
};

exports.getOneRoleByLibelle = (req, res, next) => {
    Role.findOne({ where : { libelle: req.params.libelle } })
        .then((role) => {
            res.status(200).json({ role });
        }).catch((error) => {
            res.status(404).json({ error });
    });
};

exports.updateRole = (req, res, next) => {
    Role.update(        
        req.body,
        { where: { id: req.params.id} },
    )
    .then(() => {      
        Role.findByPk(req.params.id)
            .then(role => 
                { res.status(200).json({ role }); 
            })
            .catch(error => 
            { res.status(404).json({ error }); 
        });        
    })
    .catch((error) => {
        res.status(401).json({ error });
    });
};

exports.updateRoleByLibelle = (req, res, next) => {
    Role.findOne({ where: {Libelle : { [Op.eq]: req.params.libelle}}})
        .then(role => {
            Role.update(                
                req.body,
                { where: {id: role.id} }
            )
            .then(() => {   
                Role.findByPk(role.id)
                    .then(role => 
                        { res.status(200).json({ role }); 
                    })
                    .catch(error => 
                    { res.status(401).json({ error }); 
                });
            })
            .catch(error => {
                res.status(402).json({ error });
            });
        })  
        .catch(error => {
            res.status(403).json({ error });
        });  
};

exports.deleteRole = (req, res, next) => {
    Utilisateur.findOne({ where: {RoleId: req.params.id }})
        .then((utilisateur) => {
            if (utilisateur) {
                res.status(200).json({ message: 'Suppression impossible - Error 1 !'})
            }
            Role.findByPk(req.params.id)
            .then(role => {
                if (role != null) {
                    Role.destroy({ where: { id: req.params.id } })
                        .then(() => { res.status(200).json({ message: 'suppression réussie!' }); })
                        .catch((error) => { res.status(401).json({ error }); });
                }
                else{
                    res.status(401).json({ message: 'Non retrouvé!'})
                }
            })
            .catch(error => {
                res.status(401).json(error);
            });    
        }).catch((error) => {
            res.status(400).json({ error })
        });
};

exports.getAllRoles = (req, res, next) => {
    if(req.query.libelle){
        Role.findAll({ where : { Libelle: { [Op.like]: `%${req.query.libelle}%` } }, order: ['Libelle'] })
        .then((roles) => {
            res.status(200).json({ roles });
        })
        .catch((error) => {
            res.status(400).json({ error});
        });
    }
    else{
        Role.findAll({ order: ['Libelle']})
        .then((roles) => {
            res.status(200).json({ roles });
        })
        .catch((error) => {
            res.status(400).json({ error});
        });
    }    
};