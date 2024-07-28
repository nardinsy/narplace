import { createContext, useState, FC } from "react";
import { createRelativePath } from "../helpers/api-url";
import { HasChildren } from "../helpers/props";
import useRequiredBackend from "../hooks/use-required-backend";
import useRequiredToastContext from "../hooks/use-required-toastContext";
import {
  CommentDto,
  CommentLikeDto,
  NewComment,
  NewLikeComment,
} from "../helpers/dtos";
import useRequiredAuthContext from "../hooks/use-required-authContext";

// interface CommentContextT {
//   isLoggedin: boolean;
//   comments: CommentDto[];
//   getCommetns: (placeId: string) => Promise<void>;
// }

interface CommentT {
  comments: CommentDto[];
  getCommetns: (placeId: string) => Promise<void>;
  uploadNewCommetn: (newCommetn: NewComment) => Promise<void>;
  editComment: (editedComment: CommentDto) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  likeComment: (newLikeComment: NewLikeComment) => Promise<CommentLikeDto>;
}

// type CommentT = CommentContextT | AuthCommentContextT;

const CommentContext = createContext<CommentT | undefined>(undefined);

export const CommentContextProvider: FC<HasChildren> = ({ children }) => {
  const backend = useRequiredBackend();
  const authContext = useRequiredAuthContext();
  const showSuccessToast = useRequiredToastContext().showSuccess;

  const [comments, setCommetns] = useState<CommentDto[]>([]);

  const getCommetns = async (placeId: string) => {
    const comments = await backend.getComments(placeId);
    setCommetns(comments);
    // return comments;
  };

  const uploadNewCommetn = async (newCommetn: NewComment) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Please login first");
    }
    const pic = localStorage.getItem("userPictureUrl");

    // const writer: CommentWriter = {
    //   userId: localStorage.getItem("userId")!,
    //   username: localStorage.getItem("username")!,
    //   pictureUrl: pic ? createRelativePath(pic) : undefined,
    //   placeCount: localStorage.getItem("placeCount")
    //     ? +localStorage.getItem("placeCount")! + 1
    //     : 0,
    // };

    // const comment: CommentDto = {
    //   id: Math.random().toString(),
    //   date: newCommetn.date.toString(),
    //   text: newCommetn.text,
    //   postID: newCommetn.postID,
    //   writer,
    // };

    const result = await backend.addComment(newCommetn, token);
    const comment = result.comment;
    comment.writer.pictureUrl = pic ? createRelativePath(pic) : undefined;

    setCommetns((pre) => [comment, ...pre]);
    showSuccessToast("Comment added successfully");
  };

  const editComment = async (editedComment: CommentDto) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Please login first");
    }

    await backend.editComment(editedComment, token);
    findAndEditComment(editedComment);
    setCommetns((pre) => pre);
    showSuccessToast("Comment edited successfully");
  };

  const findAndEditComment = (editedComment: CommentDto) => {
    const item = comments.find((comment) => comment.id === editedComment.id);

    if (item) {
      item.text = editedComment.text;
      // item.date = editedComment.date.toString();
    }
  };

  const deleteComment = async (commentId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Please login first");
    }

    await backend.deleteComment(commentId, token);

    setCommetns((pre) => {
      return pre.filter((comment) => comment.id !== commentId);
    });

    showSuccessToast("Comment deleted successfully");
  };

  const likeComment = async (newLikeComment: NewLikeComment) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Please login first");
    }
    const result = await backend.likeComment(newLikeComment, token);
    const commentLike = result.commentLikeDto;
    return commentLike;
  };

  const value: CommentT = {
    comments,
    getCommetns,
    uploadNewCommetn,
    editComment,
    deleteComment,
    likeComment,
  };

  return (
    <CommentContext.Provider value={value}>{children}</CommentContext.Provider>
  );
};

export default CommentContext;