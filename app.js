require('dotenv').config();

const express = require('express');
const app = express();
app.use(express.json());
const dbConnection = require('./db');

const controllers = require('./controllers');
const middleware = require('./middleware');


app.use(middleware.headers);

//TESTING THE ROUTE//

// app.use('/test', (req,res) => {
//     res.send('Testing.. Testing.. 123..')
// })


app.use('/user', controllers.userController);
app.use(middleware.validateSession);
app.use('/posts', controllers.postsController);
app.use('/comments', controllers.commentsController);


dbConnection.authenticate()
    .then(async () => await dbConnection.sync({ /*force: true*/ }))
        .then(() => {
            app.listen(process.env.PORT, () => {
                console.log(`[SERVER]: App is listening on ${ process.env.PORT }`);
            });
        })
        .catch((err) => {
            console.log(`[Server]: Server Crashed. Error = ${ err }`)
        })

