require('dotenv').config();
const Express = require('Express');
const app = Express();
const dbConnection = require('./db');

app.use(Express.json());

//TESTING THE ROUTE//

// app.use('/test', (req,res) => {
//     res.send('Testing.. Testing.. 123..')
// })

const controllers = require('./controllers');

app.use('/user', controllers.userController);

app.use(require('./middleware/validate-session'));
app.use('/posts', controllers.postsController);

dbConnection.authenticate()
    .then(() => dbConnection.sync())
    .then(() => {
        app.listen(3000, () => {
            console.log(`[Server]: App is listening on 3000.`);
        });
    })
    .catch((err) => {
        console.log(`[Server]: Server crashed. Error = ${err}`);
    });

