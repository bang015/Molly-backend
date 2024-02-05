import User from "./user";
import Comment from "./comment";
import Post from "./post";

function defineRelationships() {
  User.hasMany(Comment, { foreignKey: "userId", as: "comments" });
  Comment.belongsTo(User, { as: "user" });
  Post.belongsTo(User, {
    foreignKey: "userId",
  });
}

export { defineRelationships };
