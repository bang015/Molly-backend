import { Op, Sequelize } from "sequelize";
import User from "../models/user";
import Tag from "../models/tag";
import PostTag from "../models/post-tag";
import ProfileImage from "../models/profile-image";

export const getSearchResult = async (searchKeyword: string) => {
  const limit = 50;
  const [users, tags] = await Promise.all([
    User.findAll({
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
    }),
    Tag.findAll({
      attributes: ["id", "name", [Sequelize.fn('COUNT', Sequelize.col('postTags.id')), 'tagCount']],
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
      group: ['tag.id']
    }),
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
