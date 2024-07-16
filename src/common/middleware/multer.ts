import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

const getNand = (digit: number) =>
  JSON.stringify(Math.round(Math.random() * 10 ** digit));

const getExtension = (filename: string) => {
  const lastDot = filename.lastIndexOf(".");
  return lastDot === -1 ? "png" : filename.substring(lastDot + 1);
};

const parser = (purpose: string) => {
  try{
    return multer({
      storage: new CloudinaryStorage({
        cloudinary,
        params: async (req: any, file: any) => {
          const params: any = {
            folder: `/${purpose}`,
            format: getExtension(file.originalname), // 파일 확장자 가져오기
            public_id: new Date().valueOf() + getNand(10), // 고유한 public_id 생성
          };
          // purpose가 "post"일 때만 transformation 설정
          if (purpose === "post") {
            params.transformation = [
              { width: 897, height: 897, crop: "fill" },
            ];
          }
          return params;
        },
      }),
    });
  }catch(e) {
    console.log(e)
  }
}

// profile 및 post 업로드 설정
export const uploadProfileImage = parser("profile").single("profileImage");
export const uploadPostMedias = parser("post").array("postMedias", 5);
