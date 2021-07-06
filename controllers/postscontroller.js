const Express = require('express');
const router = Express.Router();
const validateSession = require('../middleware/validate-Session');
const { PostsModel } = require('../models');

//TESTING ROUTER//

router.get('/practice', validateSession, (req,res) => {
    res.send('Practice...')
});

//CREATING NEW POSTS//
router.post('/create', validateSession, async (req, res) => {
    const { title, date, entry } = req.body.posts;
    const { id } = req.user;
    const postsEntry = {
        title,
        date,
        sign, 
        entry,
        owner: id
    }
    try {
        const newPosts = await PostsModel.create(postsEntry);
        res.status(200).json(newPosts);
    } catch (err) {
        res.status(500).json({ error: err });
    }
    PostsModel.create(postsEntry)
});

//GET ALL POSTS//
router.get('/', async (req, res) => {
    try {
        const entries = await PostsModel.findAll();
        res.status(200).json(entries);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

//GET POSTS BY USER//
router.get('/id', validateSession, async (req, res) => {
    let { id } = req.user;
    try {
        const userPosts = await PostsModel.findAll({
            where: {
                owner: id
            }
        });
        res.status(200).json(userPosts);
    } catch (err) {
        res.status(500).json({ error: err });
    }
})

//GET POSTS BY SIGN//
router.get('/:sign', validateSession, async (req, res) => {
    let { sign } = req.params;
    try{
        const userPosts = await PostsModel.findAll({
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
        const update = await PostsModel.update(updatedPosts, query);
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
        await PostsModel.destroy(query);
        res.status(200).json({ messagage: "Post entry deleted. "});
    } catch (err) {
        res.status(500).json({ error: err });
    }
});





module.exports = router;