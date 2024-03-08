import { Op, Sequelize } from "sequelize";
import User from "../models/user";
import Tag from "../models/tag";
import PostTag from "../models/post-tag";
import ProfileImage from "../models/profile-image";

export const getSearchResult = async (searchKeyword: string) => {
  const limit = 50;
  let userSearch = false;
  let tagSearch = false;
  console.log(searchKeyword)
  searchKeyword = searchKeyword.trim().replace(/^#/, '');
  if (searchKeyword.startsWith("@")) {
    userSearch = true;
    tagSearch = false;
    console.log(1)
    searchKeyword = searchKeyword.slice(1); // @ 제거
  } else if (searchKeyword.startsWith("#")) {
    userSearch = false;
    tagSearch = true;
    console.log(2)
    searchKeyword = searchKeyword.slice(1); // # 제거
  } else {
    userSearch = true; // @ 나 #으로 시작하지 않으면 유저도 검색
    tagSearch = true; // @ 나 #으로 시작하지 않으면 태그도 검색
    console.log(3)
  }
  const [users, tags] = await Promise.all([
    userSearch ? User.findAll({
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
    }): Promise.resolve([]),
    tagSearch ? Tag.findAll({
      attributes: [
        "id",
        "name",
        [Sequelize.fn("COUNT", Sequelize.col("postTags.id")), "tagCount"],
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
    }) : Promise.resolve([]),
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
