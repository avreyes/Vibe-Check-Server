const Express = require('express');
const router = Express.Router();
const validateSession = require('../middleware');
const { models } = require('../models');

//TESTING ROUTER//

router.get('/practice', validateSession, (req,res) => {
    res.send('Practice...')
});

//CREATING NEW POSTS//
router.post('/create', async (req, res) => {
    const { title, date, sign, entry } = req.body.post;
    //const { id } = req.user;

    try {
        await models.PostsModel.create({
            title: title,
            date: date,
            sign: sign,
            entry: entry,
            // owner: id,
            userId: req.user.id
        })
        .then (
            post => {
                res.status(201).json({
                    post: post,
                    message: 'post created'
                });
            }
        )
    } catch (err) {
        res.status(500).json({
            error: `Failed to create post: ${ err }`
        });
    };
});


// router.post('/create', validateSession, async (req, res) => {
//     const { title, date, sign, entry } = req.body.posts;
//     const { id } = req.user;
//     const postsEntry = {
//         title,
//         date,
//         sign, 
//         entry,
//         owner: id
//     }
//     try {
//         const newPosts = await models.PostsModel.create(postsEntry);
//         res.status(200).json(newPosts);
//     } catch (err) {
//         res.status(500).json({ error: err });
//     }
//     models.create(postsEntry)
// });


//GET ALL POSTS//
router.get('/all', async (req, res) => {
    try {
        const entries = await models.PostsModel.findAll();
        res.status(200).json(entries);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

//GET POSTS BY DATE//

router.get('/:date', validateSession, async (req, res) => {
    let { date } = req.params;
    try {
        const userPosts = await models.PostsModel.findAll({
            where: {
                date: date
            }
        });
        res.status(200).json(userPosts);
    } catch (err) {
        res.status(500).json({ error: err });
    }
})

//GET POSTS BY SIGN//
router.get('/sign/:sign', validateSession, async (req, res) => {
    let { sign } = req.params;
    try {
        const userPosts = await models.PostsModel.findAll({
            where: {
                sign: sign
            }
        });
        res.status(200).json(userPosts);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

//UPDATE POSTS//
router.put('/edit/:entryId', validateSession, async (req, res) => {
    const { title, date, sign, entry } = res.body.posts;
    const postsId = req.params.postsId;
    const userId = req.user.id;

    const query = {
        where: {
            id: postsId,
            owner: userId
        }
    };

    const updatedPosts = {
        title: title,
        date: date,
        sign: sign,
        entry: entry
    };
    try {
        const update = await models.PostsModel.update(updatedPosts, query);
        res.status(200).json(update);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

//DELETE A POST//
router.delete('/delete/:id', validateSession, async (req, res) => {
    const ownerId = req.user.id;
    const postsId =  req.params.id;
    try {
        const query = {
            where: {
                id: postsId,
                owner: ownerId
            }
        };
        await models.destroy(query);
        res.status(200).json({ messagage: "Post entry deleted. "});
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

module.exports = router;



