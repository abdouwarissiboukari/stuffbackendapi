const {Produit, sequelize, Op} = require('../databases/sequelize');
const fs = require('fs');


exports.createProduit = async (req, res, next) => {

    const produitObject = req.file ? { ...JSON.parse(req.body.produit),
        ImageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`} : { ...JSON.parse(req.body.produit), 
        ImageUrl: `${req.protocol}://${req.get('host')}/images/default.png`};
    
    //delete produitObject.Utilisateur;
    const code = await nextCode()
    const produit= new Produit({
        ...produitObject,
        Code: code,
        UtilisateurId: req.auth.userId
    });

    produit.save()
        .then((produit) => {
            res.status(200).json({ produit})           
        }).catch((error) => {
            res.status(404).json({ error})
        });

};

const nextCode = async () => {
    const MaxCode = await Produit.findAll({
    attributes: [[sequelize.fn('max', sequelize.col('Code')), 'MaxCode']],
    raw: true,
    })    

    return String(parseInt(MaxCode[0].MaxCode) + 1).padStart(4, '0')
}

exports.updateProduit = (req, res, next) => {
    const produitObject = req.file ? { ...JSON.parse(req.body.produit),
        ImageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`} : { ...JSON.parse(req.body.produit)};

    Produit.findOne({ where: { Code: req.params.code, isDeleted: 0 } })
        .then((produit) => {
            if (produit.UtilisateurId != req.auth.userId) {
                res.status(401).json({ message: 'You are not authorized to access this product'})
            }
            else {                               
                const actualImageFile = produit.ImageUrl.split('/images/')[1];

                Produit.update(produitObject, { where: { Code: req.params.code } }, )
                    .then(() => {
                        if (req.file) {    
                            if ( actualImageFile != 'default.png'){
                                fs.unlink(`images/${actualImageFile}`, () => {})
                            }
                        } 

                        res.status(200).json({ message: 'Product updated successfully' })
                    }).catch((error) => {
                        res.status(500).json(`Error message:  ${error}`)
                    });               
            }            
        }).catch((error) => {   
            res.status(401).json(`Error message:  ${error}`)
        });
};

exports.getOneProduit = async (req, res, next) => {
    console.log( await nextCode())
    Produit.findOne({ where: { Code: req.params.code, isDeleted: 0 } })
        .then((produit) => {
            res.status(200).json({ produit})
        }).catch((error) => {
            res.status(400).json(`Error message:  ${error}`)
        });
};

exports.deleteProduit = (req, res, next) => {
    Produit.findOne({ where: { Code: req.params.code } })
        .then((produit) => {
            if(!produit) {
                res.status(404).json({ message: 'Product code invalide!'});
            }else if(produit.Utilisateur != req.auth.userId) {
                res.status(404).json({ message: 'You are not authorized to delete this product!'})
            }else {
                const fileToDelete = produit.imageUrl.split('/images/')[1];
                fs.unlink(`images/${fileToDelete}`, () => {
                    Produit.destroy({ where: { Code: req.params.code } })
                        .then(() => {
                            res.status(200).json({ message: 'Produit deleted!'})
                        }).catch((error) => {
                            res.status(400).json({ error })
                        });
                })                
            }            
        }).catch((error) => {
            res.status(400).json({ error })
        });
};

exports.getAllProduit = (req, res, next) => {
    try {
        if (req.query.filter == null || req.query.filter === ' '){
            Produit.findAll({ where: { IsDeleted: 0 }, order: ['Designation'] })
                .then((produits) => {
                    res.status(200).json(produits)
                }).catch((error) => {
                    res.status(400).json({ error })
                });
        }else {
            Produit.findAll({ where: {
                    Designation: { [Op.like]: `%${req.query.filter}%` }, 
                    isDeleted: 0 
                }
            })
            .then((produits) => {
                res.status(200).json(produits)
            }).catch((error) => {
                res.status(400).json({ error })
            });
        };
    }
    catch (error) {
        res.status(400).json({ message: error.message})
    };
    
};