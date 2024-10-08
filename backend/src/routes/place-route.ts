import { check } from "express-validator";
import routerAuth from "../lib/router-auth";
import {
  getPlaces,
  getLoggedUserPlaces,
  addPlaceWithPictureTypeFile,
  addPlaceWithPictureTypeUrl,
  editPlaceById,
  deletePlaceById,
  getAnyUserPlacesByUserId,
  getPlacePictureByUrl,
  getPlaceById,
} from "../controllers/places-controller";

import {
  addComment,
  getPlaceCommetns,
  editComment,
  deleteComment,
  likeComment,
  unlikeComment,
  replyComment,
} from "../controllers/places-comment-controller";

const placeRouter = routerAuth();
//test
// placeRouter.postAuth(
//   "/test3",
//   (user: IUser, req: Request, res: Response, next: NextFunction) => {
//     console.log("test from place router post ok");
//     console.log(user);
//     res.json({ message: "test from place router post ok", user });
//   }
// );
// placeRouter.postAuth(
//   "/test",
//   [check("title").not().isEmpty()],
//   (user: IUser, req: Request, res: Response, next: NextFunction) => {
//     console.log("test post ok");
//     res.json({ message: "Test check, check" });
//   }
// );
// placeRouter.get("/test", (req, res, next) => {
//   console.log("hello good morning");
//   res.json({ message: "test ok" });
// });

// placeRouter.get("/", getPlaces);

placeRouter.getAuth("/userPlaces", getLoggedUserPlaces);

placeRouter.postAuth(
  "/add-place-picture-file",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  addPlaceWithPictureTypeFile
);

placeRouter.postAuth(
  "/add-place-picture-url",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  addPlaceWithPictureTypeUrl
);

placeRouter.patchAuth(
  "/edit-place",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  editPlaceById
);

placeRouter.deleteAuth("/delete-place/:pid", deletePlaceById);

placeRouter.get("/any-user-places-by-userId/:uid", getAnyUserPlacesByUserId);

placeRouter.get("/place-picture/:id", getPlacePictureByUrl);

placeRouter.get("/place/:placeId", getPlaceById);

placeRouter.postAuth(
  "/addComment",
  [check("text").not().isEmpty()],
  addComment
);

placeRouter.post("/getComments", getPlaceCommetns);

placeRouter.postAuth(
  "/editComment",
  [check("text").not().isEmpty()],
  editComment
);

placeRouter.postAuth("/deleteComment", deleteComment);

placeRouter.postAuth("/like-comment", likeComment);

placeRouter.postAuth("/unlike-comment", unlikeComment);

placeRouter.postAuth("/reply-comment", replyComment);

export default placeRouter;
