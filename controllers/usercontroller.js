const router = require('express').Router();
const { models } = require('../models');
const { UniqueConstraintError } = require('sequelize/lib/errors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {

    //TESTING USER 1//
    // UserModel.create({
    //     firstName: 'Test',
    //     birthday: '01/01',
    //     email: 'test1@email.com',
    //     password: 'test1234',
    //     about: 'things things things things things things things things things things things things things things things things things things things things',
    //     zodiac: 'sign'
    // })

    let { firstName, birthday, email, password, about, zodiac } = req.body.user;

    try {
    const newUser = await models.UserModel.create({
        firstName,
        birthday,
        email,
        password: bcrypt.hashSync(password, 13), 
        about,
        zodiac
    });

    let token = jwt.sign({id: newUser.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});

    res.status(201).json({
        message: 'Successfully registered, welcome!',
        user: newUser,
        sessionToken: token
    });
} catch (err) {
    if (err instanceof UniqueConstraintError) {
        res.status(409).json({
            message: 'Email is already in use',
        });
    } else {
    res.status(500).json({
        message: 'Failed to register, please try again',
    });
    }
}
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body.user;

    try {
        const User = await models.UserModel.findOne ({
            where: {
                email: email,
            },
        })

        if(User) {
            let passwordComparison = await bcrypt.compare(password, User.password);
            if(passwordComparison) {
                const token = jwt.sign(
                    {id: User.id,},
                    process.env.JWT_SECRET,
                    {expiresIn: 60 * 60 * 24}
                )
                res.status(200).json({
                    user: User,
                    message: 'Log in successful!',
                    sessionToken: `Bearer ${ token }`
                });
            } else {
                res.status(401).json({
                    message: 'Incorrect email or password'
                });
            }
        } else {
            res.status(401).json({
                message: 'Incorrect email or password'
            })
        }
    } catch (err) {
        res.status(500).json({
            message: 'Failed to log in'
        })
    }
});
//         .then (
//             user => {
//                 if (user) {
//                     bcrypt.compare(password, user.password, (err, matches) => {
//                         if (matches) {
//                             let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 60*60*24 })
//                             res.json({
//                                 user: user,
//                                 message: 'logged in',
//                                 sessionToken: `Bearer ${ token }`
//                             })
//                         } else {
//                             res.status(502).send({
//                                 error: 'bad gateway'
//                             })
//                         }
//                     })
//                 } else {
//                     res.status(500).send({
//                         error: 'failed to authenticate'
//                     })
//                 }
//             }
//         )
//     } catch (err) {
//         res.status(501).send({
//             error: 'server does not support this functionality'
//         })
//     }
// })

router.get('/userinfo', async (req, res) => {
    try {
        await models.UserModel.findAll({
            include: [
                {
                    model: models.PostsModel,
                    include: [
                        {
                            model: models.CommentsModel
                        }
                    ]
                }
            ]
        })
        .then (
            users => {
                res.status(200).json({
                    users: users
                });
            }
        )
    } catch (err) {
        res.status(500).json({
            error: `Failed to retrieve users: ${ err }`
        });
    };
});


module.exports = router;