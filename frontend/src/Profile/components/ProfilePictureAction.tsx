import { FC, useState, MouseEvent } from "react";
import Avatar from "../UI/Avatar";
import PictureModal from "../../shared/PictureModal";
import ImageUpload from "../../shared/ImageUpload";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import classes from "./ProfileEditForm.module.css";

interface ProfilePictureActionT {
  userPictureUrl: string | undefined;
  username: string;
  token: string;
  onChangeImage: (fileFormatFile: File) => void;
  changeProfilePicture: (userNewImage: File | undefined) => Promise<void>;
}

const ProfilePictureAction: FC<ProfilePictureActionT> = ({
  userPictureUrl,
  username,
  token,
  onChangeImage,
  changeProfilePicture,
}) => {
  const [showPictureModal, setShowPictureModal] = useState(false);
  const [avatarURL, setAvatarURL] = useState<string | undefined>(
    userPictureUrl
  );
  //userPictureUrl, username, token,

  const onImageClickHandler = (event: MouseEvent<HTMLDivElement>) => {
    // event.preventDefault();
    const element = event.target as HTMLElement;
    if (element.tagName === "IMG") {
      // window.open(authContext.userPictureUrl, "_blank");
      // history.push("/photo");
      setShowPictureModal(true);
    }
  };

  const changeImage = (fileFormatFile: File) => {
    onChangeImage(fileFormatFile);
    setAvatarURL(URL.createObjectURL(fileFormatFile));

    // fileFormatFile: type object
    // File {name: '2021-10-22 7.18.jpg', lastModified: 1704866449845, lastModifiedDate: Wed Jan 10 2024 09:30:49 GMT+0330 (Iran Standard Time), webkitRelativePath: '', size: 1156073, …}

    // URL.createObjectURL(fileFormatFile): type string
    // blob:http://localhost:3000/055ee9ce-844c-43c2-9c4f-567c2da7b909
  };

  const closePictureModal = () => {
    setShowPictureModal(false);
  };

  const ellipsisDropdownItems = [
    {
      title: "Delete",
      handler: () => {
        const result = window.confirm(
          "Are you sure you want to reset your current avatar?"
        );

        if (result) {
          changeProfilePicture(undefined);
          setAvatarURL(undefined);
        }
      },
    },
    {
      title: "Save As ...",
      handler: () => {
        //navigate to profile setting page
      },
    },
  ];

  return (
    <>
      <div className={classes["user-image"]} onClick={onImageClickHandler}>
        <Avatar width={"9rem"} pictureUrl={avatarURL} alt={username} />
        <div>
          <ImageUpload
            id={token}
            onChangeImage={changeImage}
            className={classes["edit-user-image-button"]}
          >
            <FontAwesomeIcon icon={faPen} />
          </ImageUpload>
        </div>
      </div>
      {showPictureModal && (
        <PictureModal
          pictureUrl={userPictureUrl}
          showChevrons={false}
          ellipsisDropdownItems={ellipsisDropdownItems}
          xMarkHandler={closePictureModal}
        />
      )}
    </>
  );
};

export default ProfilePictureAction;
