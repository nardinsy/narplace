import { io, Socket } from "socket.io-client";

// const BASE_URL = "http://localhost:5000/api/";
const BASE_URL = "http://192.168.1.13:5000/api/";
// const BASE_URL = "http://172.20.10.4:5000/api/";
// const END_POINTS = {
//   getAllUsers: "users",
//   getuserPlaces: "places/placesByUserId/",
//   addPlace: "places/addPlace",
//   getPlaces: "places/userPlaces",
//   deletePlace: `places/`,
//   editPlace: "places/edit",
//   signup: "users/signup",
//   login: "users/login",
//   logout: "users/logout",
//   changeProfilePicture: "users/changeProfilePicture",
//   changePassword: "users/changePassword",
//   changeUsername: "users/changeUsername",
//   autoLogin: "users/autoLogin",
//   profilePicture: "users/profile-picture/",
//   placePicture: "places/place-picture/",
// };

export enum ENDPOINTS {
  getAllUsers = "users",

  signup = "users/signup",
  login = "users/login",
  logout = "users/logout",

  changeProfilePicture = "users/change/profile-picture",
  changeProfilePictureWithUrl = "users/change/profile-picture-url",
  changePassword = "users/change/password",
  changeUsername = "users/change/username",

  getLoggedUserPlaces = "places/userPlaces",
  addPlacePictureFile = "places/add-place-picture-file",
  addPlacePictureUrl = "places/add-place-picture-url",
  editPlace = "places/edit-place",
  deletePlaceById = `places/delete-place/`,
  getAnyUserPlacesByUserId = "places/any-user-places-by-userId/",
  getPlaceById = "places/place/",

  getComments = "places/getComments",
  addComment = "places/addComment",
  editComment = "places/editComment",
  deleteComment = "places/deleteComment",
  likeComment = "places/like-comment",
  unlikeComment = "places/unlike-comment",
  replyComment = "places/reply-comment",

  getNewNotifications = "users/new-notification",
  getCurrentNotifications = "users/current-notifications",
  mergeAndResetNotifications = "users/update-notifications",
}

const getApiAddress = (endPoint: string, param?: string) => {
  if (param) {
    return `${BASE_URL}${endPoint}${param}`;
  }

  return `${BASE_URL}${endPoint}`;
};

const createAbsoluteApiAddress = (path: string) => {
  if (path.startsWith("~")) {
    const reletivePath = path.slice(1);
    return `${BASE_URL}${reletivePath}`;
  } else {
    return path;
  }
  // return relativePath;
};

const createRelativePath = (absolutePath: string) => {
  // const semiPictureUrl = absolute.match(BASE_URL);
  if (absolutePath.startsWith(BASE_URL)) {
    return absolutePath.replace(BASE_URL, "~");
  } else {
    return absolutePath;
  }
  // return absolutePath.replace(BASE_URL, "");
};

export { getApiAddress, createAbsoluteApiAddress, createRelativePath };
