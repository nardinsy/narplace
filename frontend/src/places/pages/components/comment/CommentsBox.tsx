import { useEffect, useState } from "react";
import CommetnsList from "./CommentsList";
import { CommentDto } from "../../../../helpers/dtos";
import useRequiredBackend from "../../../../hooks/use-required-backend";

const CommentsBox = ({
  placeId,
  uploadedNewComment,
}: {
  placeId: string;
  uploadedNewComment: boolean;
}) => {
  const [comments, setCommetns] = useState<CommentDto[]>([]);
  const backend = useRequiredBackend();

  useEffect(() => {
    const getCommetns = async () => {
      const comments = await backend.getComments(placeId);

      setCommetns(comments);
    };

    getCommetns();
    return () => {};
  }, [uploadedNewComment]);

  const content =
    comments.length > 0 ? (
      <CommetnsList comments={comments} />
    ) : (
      <div>No comments yet!</div>
    );

  return (
    <div>
      <h3>Comments</h3>
      {content}
    </div>
  );
};

export default CommentsBox;