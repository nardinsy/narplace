import { useState, FC, useEffect } from "react";
import PlaceInfoCard from "../UI/PlaceInfoCard";
import picturePlaceholder from "../../assets/Image-placeholder.png";
import useRequiredAuthContext from "../../hooks/use-required-authContext";
import { placeInfoCard, PlaceInfoCardWithPictire } from "../../helpers/dtos";
import PictureUploadButton from "../../uploadPicture/PictureUploadButton";

interface NewPlacePageProps {
  addPlace: (place: PlaceInfoCardWithPictire) => Promise<void>;
}

type UploadedPicture = File | string;

const NewPlacePage: FC<NewPlacePageProps> = ({ addPlace }) => {
  const authContext = useRequiredAuthContext();
  if (!authContext.isLoggedin)
    throw new Error("User is not logged in, Please log in again");

  const [uploadedPicture, setUploadedPicture] = useState<string>();
  const [file, setFile] = useState<File | undefined>(undefined);

  const [pic, setPic] = useState<UploadedPicture>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const changeNewPictureFile = (file: File) => {
    // setFile(file);
    setPic(file);
    setUploadedPicture(URL.createObjectURL(file));
  };

  const changeNewPictureUrl = (url: string) => {
    setPic(url);
    setUploadedPicture(url);
  };

  const addNewPlace = (place: placeInfoCard) => {
    if (!pic || !uploadedPicture)
      throw new Error("Can not add place without file, try to add file");

    const placeInfoCardWithPictire: PlaceInfoCardWithPictire = {
      title: place.title,
      description: place.description,
      address: place.address,
      picture: pic,
    };

    addPlace(placeInfoCardWithPictire);
  };

  return (
    <div className="flex flex-col justify-center items-center mt-28 md:flex-row">
      <div className="mx-5 h-image-select-card w-11/12 md:w-3/6">
        <div className="w-full h-5/6">
          <img
            className="w-full h-full rounded-2xl object-cover"
            alt=""
            src={uploadedPicture ? uploadedPicture : picturePlaceholder}
          />
        </div>
        <div className="flex justify-center items-center my-3">
          {/* <ImageUpload
            id={authContext.token}
            onChangeImage={changeNewPicture}
            className="bg-primary text-white text-xl p-2 rounded-4xl border border-primary transition-colors hover:bg-white hover:text-primary hover:transition-all"
          >
            Upload new picture
          </ImageUpload> */}
          <PictureUploadButton
            changeNewPictureFile={changeNewPictureFile}
            changeNewPictureUrl={changeNewPictureUrl}
          />
        </div>
      </div>

      <div className="w-11/12 m-4 md:w-3/6">
        <PlaceInfoCard
          onSubmit={addNewPlace}
          submitButtonName="Post"
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
