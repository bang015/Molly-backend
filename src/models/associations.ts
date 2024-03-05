import User from "./user";
import bcrypt from "bcrypt";
import Comment from "./comment";
import Post from "./post";
import ProfileImage from "./profile-image";
import PostMedia from "./post-media";
import Follow from "./follow";
import Like from "./like";
import Bookmark from "./bookmark";
import PostTag from "./post-tag";
import Tag from "./tag";
function defineRelationships() {
  //User
  User.hasMany(Comment, { foreignKey: "userId", as: "comments" });
  User.hasMany(Bookmark, { foreignKey: "userId", as: "bookmark" });
  User.hasMany(Follow, { foreignKey: "followerId", as: "follower" });
  User.hasMany(Follow, { foreignKey: "followingId", as: "following" });
  User.belongsTo(ProfileImage, { foreignKey: "profile_image" });
  User.beforeCreate(async (user) => {
    const encryptedPw = await bcrypt.hash(user.password, 10);
    user.password = encryptedPw;
  });
  //Post
  Post.belongsTo(User, {
    foreignKey: "userId",
  });
  Post.hasMany(PostMedia, { foreignKey: "postId" });
  Post.hasMany(Comment, { foreignKey: "postId" });
  Post.hasMany(Bookmark, { foreignKey: "postId" });
  Post.hasMany(PostTag, { foreignKey: "PostId"});
  //Comment
  Comment.belongsTo(User, { as: "user" });
  Comment.belongsTo(Post, { foreignKey: "postId", as: "post" });
  //PostMedia
  PostMedia.belongsTo(Post, {
    foreignKey: "postId",
  });
  //Follow
  Follow.belongsTo(User, { foreignKey: "followerId", as: "follower" });
  Follow.belongsTo(User, { foreignKey: "followingId", as: "following" });
  //Like
  Like.belongsTo(Post, { foreignKey: "postId" });
  Like.belongsTo(User, { foreignKey: "userId" });
  //bookmark
  Bookmark.belongsTo(Post, { foreignKey: "postId" });
  Bookmark.belongsTo(User, { foreignKey: "userId" });
  //tag
  Tag.hasMany(PostTag, {foreignKey: "TagId"});
}

export { defineRelationships };
