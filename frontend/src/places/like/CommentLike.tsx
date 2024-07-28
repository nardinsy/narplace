import { MouseEvent, FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import useRequiredCommentContext from "../../hooks/use-required-commentContext";
import useRequiredAuthContext from "../../hooks/use-required-authContext";
import { CommentDto } from "../../helpers/dtos";
import classes from "./Commentlike.module.css";

type CommentLikeT = {
  commentDto: CommentDto;
};

const CommentLike: FC<CommentLikeT> = ({ commentDto }) => {
  const authCtx = useRequiredAuthContext();
  const commentCtx = useRequiredCommentContext();

  // const [commentLikeNumber, setCommentLikeNumber] = useState(commentDto.likeNo);

  const likeCommentHandler = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    // setCommentLikeNumber((pre) => pre + 1);
  };

  return (
    <div onClick={likeCommentHandler}>
      <FontAwesomeIcon icon={faHeart} className={classes["heart-button"]} />
      <span className={classes["likes-number"]}>22</span>
    </div>
  );
};

export default CommentLike;
