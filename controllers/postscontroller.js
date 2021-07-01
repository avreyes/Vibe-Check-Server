const Express = require('express');
const router = Express.Router();

//TESTING ROUTER//

// router.get('/practice', (req,res) => {
//     res.send('Practice...')
// });

router.get('/all', (req,res) => {
    res.send('Showing all Posts')
});

module.exports = router;