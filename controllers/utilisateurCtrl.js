const { Utilisateur, Role, Token } = require('../databases/sequelize')
const { Op } = require('sequelize')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const { error } = require('console')
const JWTSecret = process.env.JWT_SECRET;
const bcryptSalt = process.env.BCRYPT_SALT;
const clientURL = process.env.CLIENT_URL
const sendEmail = require('../utils/email/sendEmail')
const { getVerificationCode } = require('../helpers')

exports.signUp = (req, res, next) => {
    Role.findByPk(req.body.RoleId)
        .then(role => {
            if (role) {
                bcrypt.hash(req.body.Password, Number(bcryptSalt))
                    .then(hash => {
                        const utilisateur = new Utilisateur({...req.body, Password: hash})
                        utilisateur.save()
                            .then((utilisateur) => { 
                                requestEmailValidation(utilisateur)
                                res.status(201).json({ message: 'Utilisateur créé!', data:  utilisateur})
                            })
                            .catch((error) => { res.status(400).json({ error })});
                    })
                    .catch((error) => { 
                        res.status(400).json({ error });
                    });
            }
            else {
                res.status(400).json({ message: 'Rôle invalide !' });
            }
        })
        .catch((error) => {
            res.status(400).json({ error })
        });    
};

exports.emailValidationController = async (req, res, next) => {
    // console.log(`UserId: ${req.query.userid}`)
    let passwordResetToken = await Token.findOne({ 
        where: {UserId: req.query.userid} 
    })

    // console.log(passwordResetToken)

    if (!passwordResetToken) {
       return res.status(401).json({ message: "Invalid or expired password reset token"});
    }

    const isExpired = (((Date.now() - passwordResetToken.Created)/1000) > passwordResetToken.ExpiresIn)? true : false
    
    if(isExpired){
        return res.status(401).json({ message: "Invalid or expired password reset token"});
    }

    // console.log(passwordResetToken.Token, req.query.Token);

    const isValid = await bcrypt.compare(req.query.token, passwordResetToken.Token); 

    if (!isValid) {
        return res.status(401).json({ message: "Invalid or expired password reset token"});
    }

    await Utilisateur.findOne(        
        { where: { id: req.query.userid }},
    ).then(user => {
        user.Etat = 1
        user.save()
        .then(usr => {
            sendEmail(
                usr.Email,
                "Email validation Successfully",
                {
                name: usr.Staff,
                },
                "./template/accountValidation.handlebars"
            )
        })        
    
        passwordResetToken.destroy();
    
        return res.status(200).json({ message: "Email validation was successful" });
    })
    .catch(error => {
        return res.status(401).json({ message: error});
    })
    
};

exports.signIn = (req, res, next) => {
    Utilisateur.findOne({ 
        where: { Login: req.body.Login,  Etat: 1, IsDeleted: 0} , 
        include: [{
            model: Role,
            attributes: ['id', 'Libelle']
            }
        ]
    })
        .then((utilisateur) => {
            if (!utilisateur) {
                return res.status(401).json({ message: 'Login ou mot de passe incorrect !' });
            }            
            bcrypt.compare(req.body.Password, utilisateur.Password)
                .then(valid => {
                    if (!valid){
                        return res.status(401).json({ message: 'Login ou mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: utilisateur.id,
                        login : utilisateur.Login,
                        staff: utilisateur.Staff,
                        role: utilisateur.Role,
                        token: jwt.sign(
                            { userId: utilisateur.id },
                            JWTSecret,
                            { expiresIn: '24h' }
                        )
                    });
                })
            
        })
};

exports.updateUtilisateur = (req, res, next) => {    
    Utilisateur.update(
        req.body,
        { where: { id: req.params.id } }
    ).then((result) => {
        console.log(result)
        if(result > 0){
            res.status(200).json({ message: 'Modification réussie ! ' })
        }
        else {
            res.status(200).json({ message: 'Utilisateur dejà à jour ou incorrect ! ' })
        }
    }).catch((error) => {
        console.log(error)
        res.status(400).json({ error })
    });
};

exports.getOneUtilisateur = async (req, res, next) => {
    Utilisateur.findOne({ 
        where: { id: req.params.id, isDeleted: 0 }, 
        include: [ {
            model: Role,
            attributes: ['id', 'libelle']
        } ],
        attributes: {
            exclude: ['Password']
        }
    })
    .then((utilisateur) => {
        res.status(200).json({ utilisateur })
    }).catch((error) => {
        res.status(400).json({ error })
    });
};

exports.updateUtilisateurState = (req, res, next) => {
    Utilisateur.update(        
        { Etat: req.body.Etat},
        { where: { id: req.body.UserId, IsDeleted: 0} },
    )
    .then((result) => {
        console.log(`Resultat: ${result}`)
        if(result > 0){
            res.status(200).json({ message: 'Mise à réussie ! ' })
        }
        else {
            res.status(200).json({ message: 'utilisateur incorrect ! ' })
        }
    }).catch((error) => {
        res.status(400).json({ error })
    });
};

exports.deleteOneUtilisateur = (req, res, next) => {
    Utilisateur.update(        
        { IsDeleted: 1},
        { where: { id: req.params.id } },
    )
    .then((result) => {
        console.log(`Resultat: ${result}`)
        if(result > 0){
            res.status(200).json({ message: 'suppression réussie ! ' })
        }
        else {
            res.status(200).json({ message: 'utilisateur incorrect ! ' })
        }
    }).catch((error) => {
        res.status(400).json({ error })
    });
};

exports.getAllUtilisateur = (req, res, next) => {
    
    if (!req.query.login){
        Utilisateur.findAll({ 
            where: { isDeleted: 0 }
            , 
            include: [ {
                model: Role,
                attributes: ['id', 'Libelle']
            } ],
            attributes: {
                exclude: ['Password']
            }
        })
        .then((utilisateur) => {
            res.status(200).json({ utilisateur })
        }).catch((error) => {
            res.status(402).json({ error })
        });
    }
    else {
        
        Utilisateur.findAll({ 
            where: { Login: { [Op.like]: `%${req.query.login}%` }, isDeleted: 0 }, 
            include: [ {
                model: Role,
                attributes: ['id', 'Libelle']
            } ],
            attributes: {
                exclude: ['Password']
            }
        })
        .then((utilisateurs) => {
            res.status(200).json({ utilisateurs })
        }).catch((error) => {
            res.status(403).json({ error })
        });
    }    
};

exports.getAllUtilisateurByRole = (req, res, next) => {
    Utilisateur.findAll({ 
        where: { Role: req.params._role, isDeleted: 0 }, 
        include: [ models.Role ],
        attributes: {
            exclude: ['Password']
        }
    })
        .then((utilisateurs) => {
            res.status(200).json({ utilisateurs })
        })
        .catch((error) => {
            res.status(403).json({ error })
        });
};

exports.getCurrentUser = (req, res, next) => {
    try {
        const userId = req.auth.userId;

        if (userId !== null ){            
            res.status(200).json({ userId });
        }
    }
    catch {
        res.status(400).json({ message: 'Erreur de connexion'});
    }
}

// Password forget and reset implementation    

exports.resetPasswordRequestControllerToken = async (req, res, next) => {
        
        await Utilisateur.findOne({ 
            where: { Email: req.body.Email} 
        })
        .then((utilisateur) => {
            if (!utilisateur) return res.status(401).json({message: "Le mail n'existe pas!"})

            Token.findOne({ 
                where: { UserId: utilisateur.id } 
            }).then((token) => {
                if (token){
                    token.destroy()
                    .catch((error) => {
                        res.status(403).json({ error })
                    })                   
                }
            }) 
            
            let resetToken = crypto.randomBytes(32).toString("hex")
            bcrypt.hash(resetToken, Number(bcryptSalt))
            .then(hash => {
                new Token({
                    UserId: utilisateur.id,
                    Token: hash,
                    ExpiresIn: 86400
                }).save().then(() => {
                    const link = `${clientURL}/passwordreset?token=${resetToken}&userid=${utilisateur.id}`
            
                    sendEmail(
                        utilisateur.Email,
                        "Password Reset Request",
                        {
                            name: utilisateur.Staff,
                            link: link,
                        },
                        "./template/requestResetPassword.handlebars"
                    ).then(result => {
                        console.log(result)
                    })
                    
                                
                    return res.status(200).json(link);
                })   
            })                  
        }) 
        .catch(error => {
            res.status(405).json({ data: error })
        })         
 
}

exports.resetPasswordRequestControllerCode = async (req, res, next) => {
    let resetCode = await getVerificationCode(6)

    await Utilisateur.findOne({ 
        where: { Email: req.body.Email} 
    })
    .then((utilisateur) => {
        if (!utilisateur) return res.status(401).json({message: "Le mail n'existe pas!"})

        Token.findOne({ 
            where: { UserId: utilisateur.id } 
        }).then((token) => {
            if (token){
                token.destroy()
                .catch((error) => {
                    res.status(403).json({ error })
                })                   
            }
        })         
        
        bcrypt.hash(resetCode.toString(), Number(bcryptSalt))
        .then(hash => {
            new Token({
                UserId: utilisateur.id,
                Code: hash,
                ExpiresIn: 86400
            }).save().then(() => {

                // const link = `${clientURL}/passwordreset?token=${resetToken}&userid=${utilisateur.id}`
        
                sendEmail(
                    utilisateur.Email,
                    "Password Reset Request",
                    {
                        name: utilisateur.Staff,
                        link: resetCode,
                    },
                    "./template/requestResetPasswordCode.handlebars"
                ).then(result => {
                    console.log(result)
                })                
                            
                return res.status(200).json(resetCode);
            })   
        })                  
    }) 
    .catch(error => {
        res.status(405).json({ data: error })
    })         

}

exports.resetPasswordController = async (req, res, next) => {
    const reqToken = (req.query.token)? req.query.token: req.body.Code
    const reqUserId = (req.query.userid)? req.query.userid: req.body.UserId
    
    let passwordResetToken = await Token.findOne({ 
        where: {UserId: reqUserId} 
    })

    if (!passwordResetToken) {
       return res.status(401).json({ message: "Invalid or expired password reset token"});
    }

    const isExpired = (((Date.now() - passwordResetToken.Created)/1000) > passwordResetToken.ExpiresIn)? true : false

    if(isExpired){
        return res.status(401).json({ message: "Invalid or expired password reset token"});
    }

    // console.log(passwordResetToken.Token, req.query.Token);

    const isValid = await bcrypt.compare(reqToken, (req.query.token)? passwordResetToken.Token: passwordResetToken.Code);

    if (!isValid) {
        return res.status(401).json({ message: "Invalid or expired password reset token"});
    }

    const hash = await bcrypt.hash(req.body.Password, Number(bcryptSalt));

    await Utilisateur.update(        
        { Password: hash },
        { where: { id: reqUserId }},
    );

    const user = await Utilisateur.findByPk(reqUserId);

    sendEmail(
        user.Email,
        "Password Reset Successfully",
        {
        name: user.Staff,
        },
        "./template/resetPassword.handlebars"
    );

    await passwordResetToken.destroy();

    return res.status(200).json({ message: "Password reset was successful" });
  };

  const requestEmailValidation = async (utilisateur) => {
    const user = utilisateur //await Utilisateur.findOne({ where: {Email: email} });
    if (!user) throw new Error("Email does not exist");
  
    let token = await Token.findOne({ where: { userId: user.id } });
    if (token) await token.deleteOne();
  
    let resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));
    // console.log(hash)

    await new Token({
      UserId: user.id,
      Token: hash,
      ExpiresIn: 86400
    }).save();
  
    const link = `${clientURL}emailvalidation?token=${resetToken}&userid=${user.id}`;
  
    sendEmail(
      user.Email,
      "Email address confirmation",
      {
        name: user.Staff,
        link: link,
      },
      "./template/requestAccountValidation.handlebars"
    );
    return { link };
  };
