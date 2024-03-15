import { Op, Sequelize } from "sequelize";
import User from "../models/user";
import Tag from "../models/tag";
import PostTag from "../models/post-tag";
import ProfileImage from "../models/profile-image";

export const getSearchResult = async (searchKeyword: string, type: string) => {
  const limit = 50;
  let userSearch = false;
  let tagSearch = false;
  if (type === "user") {
    userSearch = true;
    tagSearch = false;
  } else if (type === "tag") {
    userSearch = false;
    tagSearch = true;
  } else {
    userSearch = true;
    tagSearch = true;
  }
  const [users, tags] = await Promise.all([
    userSearch
      ? User.findAll({
          attributes: ["id", "name", "nickname"],
          where: {
            [Op.or]: [
              { nickname: { [Op.like]: `%${searchKeyword}%` } },
              { name: { [Op.like]: `%${searchKeyword}%` } },
            ],
          },
          include: {
            model: ProfileImage,
            attributes: ["path"],
          },
        })
      : Promise.resolve([]),
    tagSearch
      ? Tag.findAll({
          attributes: [
            "id",
            "name",
            [Sequelize.fn("COUNT", Sequelize.col("PostTags.id")), "tagCount"],
          ],
          where: {
            name: { [Op.like]: `%${searchKeyword}%` },
          },
          include: [
            {
              model: PostTag,
              attributes: [],
              required: false,
            },
          ],
          group: ["tag.id"],
        })
      : Promise.resolve([]),
  ]);
  const usersWithType = users.map((user) => ({
    ...user.toJSON(),
    type: "user",
  }));
  const tagsWithType = tags.map((tag) => ({ ...tag.toJSON(), type: "tag" }));

  const result = [...usersWithType, ...tagsWithType].sort(
    () => Math.random() - 0.5
  );
  return result;
};
