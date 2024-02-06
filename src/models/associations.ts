import User from "./user";
import bcrypt from "bcrypt";
import Comment from "./comment";
import Post from "./post";
import ProfileImage from "./profile-image";

function defineRelationships() {
  //User
  User.hasMany(Comment, { foreignKey: "userId", as: "comments" });
  User.belongsTo(ProfileImage, { foreignKey: "profile_image" });
  User.beforeCreate(async (user) => {
    const encryptedPw = await bcrypt.hash(user.password, 10);
    user.password = encryptedPw;
  });
  //Post
  Post.belongsTo(User, {
    foreignKey: "userId",
  });
  //Comment
  Comment.belongsTo(User, { as: "user" });
  Comment.belongsTo(Post, {foreignKey: "postId", as: "post"});
}

export { defineRelationships };
