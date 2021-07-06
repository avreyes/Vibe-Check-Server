const db = require('../db');

const UserModel = require('./user');
const PostsModel = require('./posts');
const CommentsModel = require('./comments');

UserModel.hasMany(PostsModel);
UserModel.hasMany(CommentsModel);

PostsModel.belongsTo(UserModel);
PostsModel.hasMany(CommentsModel);

CommentsModel.belongsTo(PostsModel);

module.exports = {
    dbConnection: db,
    models: {
        UserModel,
        PostsModel,
        CommentsModel
    }
};