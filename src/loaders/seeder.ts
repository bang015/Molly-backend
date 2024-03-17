import Post from "../models/post";
import PostMedia from "../models/post-media";
import PostTag from "../models/post-tag";
import ProfileImage from "../models/profile-image";
import Tag from "../models/tag";
import User from "../models/user";

export default async (): Promise<void> => {
  await User.bulkCreate([
    {
      id: 1,
      email: "test123@naver.com",
      nickname: "chag10_1",
      password: "$2b$10$5x4pW12UNPvpdPbf1YB.b.Z7ZHMKsqNYFJPRS13IMvjD16h.IGxdS",
      name: "창현",
      profile_image: 47,
      created_at: "2023-12-26 18:34:16",
      updated_at: "2024-03-17 09:16:12",
    },
    {
      id: 2,
      email: "qwe11@naver.com",
      nickname: "ichiharajunichiro",
      password: "$2b$10$OIBV7zUQ6m3nkpktJ1hhAeaszG1RiWFhmX6vqlIprzJqspZyXQKHG",
      name: "움마",
      introduce: "ㅋㅋ",
      profile_image: 49,
      created_at: "2024-01-03 00:00:49",
      updated_at: "2024-03-17 09:50:37",
    },
    {
      id: 3,
      email: "qwe12@naver.com",
      nickname: "may50_11",
      password: "$2b$10$bwIOjQfYrQL1KrX678odPueQw5taaiOUYadqcpaH/UsTiVkbHEGsW",
      name: "수채화",
      profile_image: 48,
      created_at: "2024-01-04 02:34:27",
      updated_at: "2024-03-17 09:17:26",
    },
  ]);
  await ProfileImage.bulkCreate([
    {
      id: 47,
      name: "profile/17106669710993764357103",
      type: "application/octet-stream",
      path: "https://res.cloudinary.com/dgdfpv0y8/image/upload/v1710666970/profile/17106669710993764357103.jpg",
      createdAt: "2024-03-17 09:16:12",
      updatedAt: "2024-03-17 09:16:12",
    },
    {
      id: 48,
      name: "profile/17106670448346318141265",
      type: "application/octet-stream",
      path: "https://res.cloudinary.com/dgdfpv0y8/image/upload/v1710667044/profile/17106670448346318141265.jpg",
      createdAt: "2024-03-17 09:17:26",
      updatedAt: "2024-03-17 09:17:26",
    },
    {
      id: 49,
      name: "profile/17106690359637899325324",
      type: "application/octet-stream",
      path: "https://res.cloudinary.com/dgdfpv0y8/image/upload/v1710669036/profile/17106690359637899325324.jpg",
      createdAt: "2024-03-17 09:50:37",
      updatedAt: "2024-03-17 09:50:37",
    },
  ]);
  await Post.bulkCreate([
    {
      id: 45,
      userId: 3,
      content:
        '2024-01-11 ..<br><br><span style="color: rgb(0, 55, 107);">#수채화</span> <span style="color: rgb(0, 55, 107);">#그림</span>',
      createdAt: "2024-03-17 09:20:02",
      updatedAt: "2024-03-17 09:20:02",
    },
    {
      id: 46,
      userId: 3,
      content:
        '2024-01-23 ..<br><br><span style="color: rgb(0, 55, 107);">#수채화</span> <span style="color: rgb(0, 55, 107);">#그림</span>',
      createdAt: "2024-03-17 09:21:13",
      updatedAt: "2024-03-17 09:21:13",
    },
    {
      id: 47,
      userId: 3,
      content:
        '2024-03-21 ..<br><br><span style="color: rgb(0, 55, 107);">#수채화</span> <span style="color: rgb(0, 55, 107);">#그림</span>',
      createdAt: "2024-03-17 09:22:10",
      updatedAt: "2024-03-17 09:22:10",
    },
    {
      id: 48,
      userId: 2,
      content:
        '너무 맛있어<br><br><span style="color: rgb(0, 55, 107);">#맛집</span> ',
      createdAt: "2024-03-17 09:44:27",
      updatedAt: "2024-03-17 09:44:27",
    },
    {
      id: 49,
      userId: 2,
      content:
        '혈관 막히는 맛 <br><br><span style="color: rgb(0, 55, 107);">#맛집</span> <span style="color: rgb(0, 55, 107);">#맛있다</span> <span style="color: rgb(0, 55, 107);">#냠냠</span>',
      createdAt: "2024-03-17 09:47:48",
      updatedAt: "2024-03-17 09:47:48",
    },
    {
      id: 50,
      userId: 2,
      content:
        'ㅎㅎ<br><br><span style="color: rgb(0, 55, 107);">#맛있다</span> <span style="color: rgb(0, 55, 107);">#냠냠</span> <span style="color: rgb(0, 55, 107);">#달다</span> <span style="color: rgb(0, 55, 107);">#후식</span>',
      createdAt: "2024-03-17 09:48:37",
      updatedAt: "2024-03-17 09:50:12",
    },
    {
      id: 51,
      userId: 2,
      content:
        'ㅎㅎ<br><br><span style="color: rgb(0, 55, 107);">#맛있다</span> <span style="color: rgb(0, 55, 107);">#냠냠</span>',
      createdAt: "2024-03-17 09:49:22",
      updatedAt: "2024-03-17 09:49:22",
    },
    {
      id: 52,
      userId: 2,
      content:
        '달다<br><br><span style="color: rgb(0, 55, 107);">#달다</span> <span style="color: rgb(0, 55, 107);">#후식</span> <span style="color: rgb(0, 55, 107);">#커피</span>',
      createdAt: "2024-03-17 09:50:00",
      updatedAt: "2024-03-17 09:50:00",
    },
    {
      id: 55,
      userId: 1,
      content:
        '떼껄룩<br><br><span style="color: rgb(0, 55, 107);">#그림</span> <span style="color: rgb(0, 55, 107);">#고양이</span> <span style="color: rgb(0, 55, 107);">#떼껄룩</span>',
      createdAt: "2024-03-17 10:09:37",
      updatedAt: "2024-03-17 10:09:37",
    },
    {
      id: 56,
      userId: 1,
      content:
        '힐링<br><br><span style="color: rgb(0, 55, 107);">#그림</span> <span style="color: rgb(0, 55, 107);">#힐링</span> <span style="color: rgb(0, 55, 107);">#편안</span>',
      createdAt: "2024-03-17 10:10:02",
      updatedAt: "2024-03-17 10:10:02",
    },
    {
      id: 57,
      userId: 1,
      content:
        '떼껄룩<br><br><span style="color: rgb(0, 55, 107);">#그림</span> <span style="color: rgb(0, 55, 107);">#고양이</span> <span style="color: rgb(0, 55, 107);">#떼껄룩</span> <span style="color: rgb(0, 55, 107);">#편안</span>',
      createdAt: "2024-03-17 10:10:47",
      updatedAt: "2024-03-17 10:10:47",
    },
    {
      id: 58,
      userId: 1,
      content:
        '떼껄룩<br><br><span style="color: rgb(0, 55, 107);">#그림</span> <span style="color: rgb(0, 55, 107);">#고양이</span> <span style="color: rgb(0, 55, 107);">#떼껄룩</span> <span style="color: rgb(0, 55, 107);">#편안</span>',
      createdAt: "2024-03-17 10:11:22",
      updatedAt: "2024-03-17 10:11:22",
    },
    {
      id: 59,
      userId: 1,
      content:
        '떼껄룩<br><br><span style="color: rgb(0, 55, 107);">#그림</span> <span style="color: rgb(0, 55, 107);">#고양이</span> <span style="color: rgb(0, 55, 107);">#떼껄룩</span> <span style="color: rgb(0, 55, 107);">#힐링</span>',
      createdAt: "2024-03-17 10:11:51",
      updatedAt: "2024-03-17 10:11:51",
    },
    {
      id: 60,
      userId: 1,
      content:
        '떼껄룩<br><br><span style="color: rgb(0, 55, 107);">#그림</span> <span style="color: rgb(0, 55, 107);">#고양이</span> <span style="color: rgb(0, 55, 107);">#떼껄룩</span> <span style="color: rgb(0, 55, 107);">#힐링</span>',
      createdAt: "2024-03-17 10:12:04",
      updatedAt: "2024-03-17 10:12:04",
    },
  ]);
  await PostMedia.bulkCreate([
    {
      id: 1,
      postId: 45,
      name: "post/17106672004758738533400",
      type: "image/jpeg",
      path: "https://res.cloudinary.com/dgdfpv0y8/image/upload/v1710667200/post/17106672004758738533400.png",
      createdAt: "2024-03-17 09:20:02",
      updatedAt: "2024-03-17 09:20:02",
    },
    {
      id: 2,
      postId: 46,
      name: "post/17106672709918215087262",
      type: "image/jpeg",
      path: "https://res.cloudinary.com/dgdfpv0y8/image/upload/v1710667270/post/17106672709918215087262.png",
      createdAt: "2024-03-17 09:21:13",
      updatedAt: "2024-03-17 09:21:13",
    },
    {
      id: 3,
      postId: 47,
      name: "post/17106673262339613640289",
      type: "image/jpeg",
      path: "https://res.cloudinary.com/dgdfpv0y8/image/upload/v1710667326/post/17106673262339613640289.png",
      createdAt: "2024-03-17 09:22:10",
      updatedAt: "2024-03-17 09:22:10",
    },
    {
      id: 4,
      postId: 48,
      name: "post/17106686624151730456853",
      type: "image/jpeg",
      path: "https://res.cloudinary.com/dgdfpv0y8/image/upload/v1710668662/post/17106686624151730456853.png",
      createdAt: "2024-03-17 09:44:27",
      updatedAt: "2024-03-17 09:44:27",
    },
    {
      id: 5,
      postId: 49,
      name: "post/17106688641323314943015",
      type: "image/jpeg",
      path: "https://res.cloudinary.com/dgdfpv0y8/image/upload/v1710668864/post/17106688641323314943015.png",
      createdAt: "2024-03-17 09:47:48",
      updatedAt: "2024-03-17 09:47:48",
    },
    {
      id: 6,
      postId: 50,
      name: "post/17106689136293059340291",
      type: "image/jpeg",
      path: "https://res.cloudinary.com/dgdfpv0y8/image/upload/v1710668913/post/17106689136293059340291.png",
      createdAt: "2024-03-17 09:48:37",
      updatedAt: "2024-03-17 09:48:37",
    },
    {
      id: 7,
      postId: 51,
      name: "post/17106689577953370097859",
      type: "image/jpeg",
      path: "https://res.cloudinary.com/dgdfpv0y8/image/upload/v1710668958/post/17106689577953370097859.png",
      createdAt: "2024-03-17 09:49:22",
      updatedAt: "2024-03-17 09:49:22",
    },
    {
      id: 8,
      postId: 52,
      name: "post/17106689977452814906808",
      type: "image/jpeg",
      path: "https://res.cloudinary.com/dgdfpv0y8/image/upload/v1710668997/post/17106689977452814906808.png",
      createdAt: "2024-03-17 09:50:00",
      updatedAt: "2024-03-17 09:50:00",
    },
    {
      id: 9,
      postId: 55,
      name: "post/17106701752562367253971",
      type: "image/jpeg",
      path: "https://res.cloudinary.com/dgdfpv0y8/image/upload/v1710670175/post/17106701752562367253971.png",
      createdAt: "2024-03-17 10:09:37",
      updatedAt: "2024-03-17 10:09:37",
    },
    {
      id: 10,
      postId: 56,
      name: "post/17106701997307564604143",
      type: "image/jpeg",
      path: "https://res.cloudinary.com/dgdfpv0y8/image/upload/v1710670199/post/17106701997307564604143.png",
      createdAt: "2024-03-17 10:10:02",
      updatedAt: "2024-03-17 10:10:02",
    },
    {
      id: 11,
      postId: 57,
      name: "post/17106702449699188562538",
      type: "image/jpeg",
      path: "https://res.cloudinary.com/dgdfpv0y8/image/upload/v1710670244/post/17106702449699188562538.png",
      createdAt: "2024-03-17 10:10:47",
      updatedAt: "2024-03-17 10:10:47",
    },
    {
      id: 12,
      postId: 58,
      name: "post/1710670280274658678090",
      type: "image/jpeg",
      path: "https://res.cloudinary.com/dgdfpv0y8/image/upload/v1710670280/post/1710670280274658678090.png",
      createdAt: "2024-03-17 10:11:22",
      updatedAt: "2024-03-17 10:11:22",
    },
    {
      id: 13,
      postId: 59,
      name: "post/17106703095444802570944",
      type: "image/jpeg",
      path: "https://res.cloudinary.com/dgdfpv0y8/image/upload/v1710670309/post/17106703095444802570944.png",
      createdAt: "2024-03-17 10:11:51",
      updatedAt: "2024-03-17 10:11:51",
    },
    {
      id: 14,
      postId: 60,
      name: "post/17106703229463176046886",
      type: "image/jpeg",
      path: "https://res.cloudinary.com/dgdfpv0y8/image/upload/v1710670322/post/17106703229463176046886.png",
      createdAt: "2024-03-17 10:12:04",
      updatedAt: "2024-03-17 10:12:04",
    },
  ]);
  await PostTag.bulkCreate([
    {
      id: 27,
      createdAt: "2024-03-17 09:20:02",
      updatedAt: "2024-03-17 09:20:02",
      PostId: 45,
      TagId: 11,
    },
    {
      id: 28,
      createdAt: "2024-03-17 09:20:02",
      updatedAt: "2024-03-17 09:20:02",
      PostId: 45,
      TagId: 12,
    },
    {
      id: 29,
      createdAt: "2024-03-17 09:21:13",
      updatedAt: "2024-03-17 09:21:13",
      PostId: 46,
      TagId: 11,
    },
    {
      id: 30,
      createdAt: "2024-03-17 09:21:13",
      updatedAt: "2024-03-17 09:21:13",
      PostId: 46,
      TagId: 12,
    },
    {
      id: 31,
      createdAt: "2024-03-17 09:22:10",
      updatedAt: "2024-03-17 09:22:10",
      PostId: 47,
      TagId: 11,
    },
    {
      id: 32,
      createdAt: "2024-03-17 09:22:10",
      updatedAt: "2024-03-17 09:22:10",
      PostId: 47,
      TagId: 12,
    },
    {
      id: 33,
      createdAt: "2024-03-17 09:44:27",
      updatedAt: "2024-03-17 09:44:27",
      PostId: 48,
      TagId: 13,
    },
    {
      id: 34,
      createdAt: "2024-03-17 09:47:48",
      updatedAt: "2024-03-17 09:47:48",
      PostId: 49,
      TagId: 13,
    },
    {
      id: 35,
      createdAt: "2024-03-17 09:47:48",
      updatedAt: "2024-03-17 09:47:48",
      PostId: 49,
      TagId: 14,
    },
    {
      id: 36,
      createdAt: "2024-03-17 09:47:48",
      updatedAt: "2024-03-17 09:47:48",
      PostId: 49,
      TagId: 15,
    },
    {
      id: 39,
      createdAt: "2024-03-17 09:49:22",
      updatedAt: "2024-03-17 09:49:22",
      PostId: 51,
      TagId: 14,
    },
    {
      id: 40,
      createdAt: "2024-03-17 09:49:22",
      updatedAt: "2024-03-17 09:49:22",
      PostId: 51,
      TagId: 15,
    },
    {
      id: 41,
      createdAt: "2024-03-17 09:50:00",
      updatedAt: "2024-03-17 09:50:00",
      PostId: 52,
      TagId: 16,
    },
    {
      id: 42,
      createdAt: "2024-03-17 09:50:00",
      updatedAt: "2024-03-17 09:50:00",
      PostId: 52,
      TagId: 17,
    },
    {
      id: 43,
      createdAt: "2024-03-17 09:50:00",
      updatedAt: "2024-03-17 09:50:00",
      PostId: 52,
      TagId: 18,
    },
    {
      id: 44,
      createdAt: "2024-03-17 09:50:12",
      updatedAt: "2024-03-17 09:50:12",
      PostId: 50,
      TagId: 14,
    },
    {
      id: 45,
      createdAt: "2024-03-17 09:50:12",
      updatedAt: "2024-03-17 09:50:12",
      PostId: 50,
      TagId: 15,
    },
    {
      id: 46,
      createdAt: "2024-03-17 09:50:12",
      updatedAt: "2024-03-17 09:50:12",
      PostId: 50,
      TagId: 16,
    },
    {
      id: 47,
      createdAt: "2024-03-17 09:50:12",
      updatedAt: "2024-03-17 09:50:12",
      PostId: 50,
      TagId: 17,
    },
    {
      id: 52,
      createdAt: "2024-03-17 10:09:37",
      updatedAt: "2024-03-17 10:09:37",
      PostId: 55,
      TagId: 12,
    },
    {
      id: 53,
      createdAt: "2024-03-17 10:09:37",
      updatedAt: "2024-03-17 10:09:37",
      PostId: 55,
      TagId: 21,
    },
    {
      id: 54,
      createdAt: "2024-03-17 10:09:37",
      updatedAt: "2024-03-17 10:09:37",
      PostId: 55,
      TagId: 22,
    },
    {
      id: 55,
      createdAt: "2024-03-17 10:10:02",
      updatedAt: "2024-03-17 10:10:02",
      PostId: 56,
      TagId: 12,
    },
    {
      id: 56,
      createdAt: "2024-03-17 10:10:02",
      updatedAt: "2024-03-17 10:10:02",
      PostId: 56,
      TagId: 23,
    },
    {
      id: 57,
      createdAt: "2024-03-17 10:10:02",
      updatedAt: "2024-03-17 10:10:02",
      PostId: 56,
      TagId: 24,
    },
    {
      id: 58,
      createdAt: "2024-03-17 10:10:47",
      updatedAt: "2024-03-17 10:10:47",
      PostId: 57,
      TagId: 12,
    },
    {
      id: 59,
      createdAt: "2024-03-17 10:10:47",
      updatedAt: "2024-03-17 10:10:47",
      PostId: 57,
      TagId: 21,
    },
    {
      id: 60,
      createdAt: "2024-03-17 10:10:47",
      updatedAt: "2024-03-17 10:10:47",
      PostId: 57,
      TagId: 22,
    },
    {
      id: 61,
      createdAt: "2024-03-17 10:10:47",
      updatedAt: "2024-03-17 10:10:47",
      PostId: 57,
      TagId: 24,
    },
    {
      id: 62,
      createdAt: "2024-03-17 10:11:22",
      updatedAt: "2024-03-17 10:11:22",
      PostId: 58,
      TagId: 12,
    },
    {
      id: 63,
      createdAt: "2024-03-17 10:11:22",
      updatedAt: "2024-03-17 10:11:22",
      PostId: 58,
      TagId: 21,
    },
    {
      id: 64,
      createdAt: "2024-03-17 10:11:22",
      updatedAt: "2024-03-17 10:11:22",
      PostId: 58,
      TagId: 22,
    },
    {
      id: 65,
      createdAt: "2024-03-17 10:11:22",
      updatedAt: "2024-03-17 10:11:22",
      PostId: 58,
      TagId: 24,
    },
    {
      id: 66,
      createdAt: "2024-03-17 10:11:51",
      updatedAt: "2024-03-17 10:11:51",
      PostId: 59,
      TagId: 12,
    },
    {
      id: 67,
      createdAt: "2024-03-17 10:11:51",
      updatedAt: "2024-03-17 10:11:51",
      PostId: 59,
      TagId: 21,
    },
    {
      id: 68,
      createdAt: "2024-03-17 10:11:51",
      updatedAt: "2024-03-17 10:11:51",
      PostId: 59,
      TagId: 22,
    },
    {
      id: 69,
      createdAt: "2024-03-17 10:11:51",
      updatedAt: "2024-03-17 10:11:51",
      PostId: 59,
      TagId: 23,
    },
    {
      id: 70,
      createdAt: "2024-03-17 10:12:05",
      updatedAt: "2024-03-17 10:12:05",
      PostId: 60,
      TagId: 12,
    },
    {
      id: 71,
      createdAt: "2024-03-17 10:12:05",
      updatedAt: "2024-03-17 10:12:05",
      PostId: 60,
      TagId: 21,
    },
    {
      id: 72,
      createdAt: "2024-03-17 10:12:05",
      updatedAt: "2024-03-17 10:12:05",
      PostId: 60,
      TagId: 22,
    },
    {
      id: 73,
      createdAt: "2024-03-17 10:12:05",
      updatedAt: "2024-03-17 10:12:05",
      PostId: 60,
      TagId: 23,
    },
  ]);
  await Tag.bulkCreate([
    {
      id: 11,
      name: "수채화",
      createdAt: "2024-03-17 09:20:02",
      updatedAt: "2024-03-17 09:20:02",
    },
    {
      id: 12,
      name: "그림",
      createdAt: "2024-03-17 09:20:02",
      updatedAt: "2024-03-17 09:20:02",
    },
    {
      id: 13,
      name: "맛집",
      createdAt: "2024-03-17 09:44:27",
      updatedAt: "2024-03-17 09:44:27",
    },
    {
      id: 14,
      name: "맛있다",
      createdAt: "2024-03-17 09:47:48",
      updatedAt: "2024-03-17 09:47:48",
    },
    {
      id: 15,
      name: "냠냠",
      createdAt: "2024-03-17 09:47:48",
      updatedAt: "2024-03-17 09:47:48",
    },
    {
      id: 16,
      name: "달다",
      createdAt: "2024-03-17 09:50:00",
      updatedAt: "2024-03-17 09:50:00",
    },
    {
      id: 17,
      name: "후식",
      createdAt: "2024-03-17 09:50:00",
      updatedAt: "2024-03-17 09:50:00",
    },
    {
      id: 18,
      name: "커피",
      createdAt: "2024-03-17 09:50:00",
      updatedAt: "2024-03-17 09:50:00",
    },
    {
      id: 21,
      name: "고양이",
      createdAt: "2024-03-17 10:09:37",
      updatedAt: "2024-03-17 10:09:37",
    },
    {
      id: 22,
      name: "떼껄룩",
      createdAt: "2024-03-17 10:09:37",
      updatedAt: "2024-03-17 10:09:37",
    },
    {
      id: 23,
      name: "힐링",
      createdAt: "2024-03-17 10:10:02",
      updatedAt: "2024-03-17 10:10:02",
    },
    {
      id: 24,
      name: "편안",
      createdAt: "2024-03-17 10:10:02",
      updatedAt: "2024-03-17 10:10:02",
    },
  ]);
};
