import { useState, FC } from "react";
import ImageUpload from "../../shared/ImageUpload";
import PlaceInfoCard from "../UI/PlaceInfoCard";
import classes from "./NewPlacePage.module.css";
import picturePlaceholder from "../../assets/picturePlaceholder.png";
import useAuthContext from "../../Hooks/Auth";

// interface NewPlacePageProps {
//   addPlace: (place: {
//     title: string,
//     description: string,
//     address: string,
//     image: File,
//   }) => Promise<void>;
// }
const NewPlacePage = ({ addPlace }) => {
  const authContext = useAuthContext();

  const [uploadedPicture, setUploadedPicture] = useState(undefined);
  const [file, setFile] = useState(undefined);

  const changeNewPicture = (file) => {
    setFile(file);
    setUploadedPicture(URL.createObjectURL(file));
  };

  return (
    <div className={classes["new-place-page-container"]}>
      <div className={classes["selection-container"]}>
        <div className={classes["picture"]}>
          <img
            className={classes["uploaded-picture"]}
            src={uploadedPicture ? uploadedPicture : picturePlaceholder}
          />
        </div>
        <div className={classes["upload-picture-button-container"]}>
          <ImageUpload
            id={authContext.token}
            onChangeImage={changeNewPicture}
            className={classes["select-picture-button"]}
          >
            Upload new picture
          </ImageUpload>
        </div>
      </div>

      <div className={classes["place-info"]}>
        <PlaceInfoCard
          onSubmit={addPlace}
          submitButtonName="Post"
          placeInfo={{ image: file }}
          onCancel={() => {
            setUploadedPicture(undefined);
            setFile(undefined);
          }}
        />
      </div>
    </div>
  );
};

export default NewPlacePage;
