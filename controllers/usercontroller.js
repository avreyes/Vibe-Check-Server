const router = require('express').Router();
const { UserModel } = require('../models');
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
    const User = await UserModel.create({
        firstName,
        birthday,
        email,
        password: bcrypt.hashSync(password, 13), 
        about,
        zodiac
    });

    let token = jwt.sign({id: User.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});

    res.status(201).json({
        message: 'Successfully registered, welcome!',
        user: User,
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
    let { email, password } = req.body.user;

    try {
        let loginUser = await UserModel.findOne ({
            where: {
                email: email,
            },
        });

    if (loginUser) {

        let passwordComparison = await bcrypt.compare(password, loginUser.password);

        if (passwordComparison) {

        let token = jwt.sign({id: loginUser.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});

        res.status(200).json({
            user: loginUser,
            message: 'Successfully logged in!',
            sessionToken: token
        });
    } else {
        res.status(401).json({
            message: 'Incorrect email or password'
        })
    }

    } else {
        res.status(401).json({
            message: 'Incorrect email or password'
        });
    }
    } catch (error) {
        res.status(500).json({
            message: 'Failed to log user in'
        })
    }
});


module.exports = router;