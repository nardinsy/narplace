import { useState, FC, MouseEvent } from "react";
import PlaceCard from "../UI/PlaceCard";
import MessageModal from "../../shared-UI/MessageModal";
import EditPlaceModal from "./EditPlaceModal";
import Button from "../../shared-UI/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import classes from "./EditablePlaceItem.module.css";
import { PlaceDto, UserDto, placeInfoCard } from "../../helpers/dtos";

interface EditablePlaceItemProps {
  placeDto: PlaceDto;
  userDto: UserDto;
  editPlace: (placeInfo: placeInfoCard & { id: string }) => Promise<void>;
  deletePlace: (placeId: any) => Promise<void>;
}

const EditablePlaceItem: FC<EditablePlaceItemProps> = ({
  placeDto,
  userDto,
  editPlace,
  deletePlace,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState("");

  // const { id, title, description, pictureUrl, address } = placeDto;

  const showEditModalHandler = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };

  const deletePlaceHandler = (id: string) => {
    setShowEditModal(false);
    setShowMessageModal(true);
    setSelectedPlaceId(id);
  };

  const confirmToDeleteByUserHandler = async (event: MouseEvent) => {
    event.preventDefault();
    setShowMessageModal(false);
    await deletePlace(selectedPlaceId);
  };

  const cancelToDeleteByUserHandler = (event: MouseEvent) => {
    event.preventDefault();
    setShowMessageModal(false);
    setShowEditModal(true);
  };

  return (
    <>
      <PlaceCard placeDto={placeDto} userDto={userDto}>
        <div
          className={classes["place-edit-button"]}
          onClick={showEditModalHandler}
        >
          <FontAwesomeIcon icon={faPen} />
        </div>
      </PlaceCard>

      {showEditModal && (
        <EditPlaceModal
          editPlace={editPlace}
          placeDto={placeDto}
          closeEditModal={closeEditModal}
          onDeletePlace={deletePlaceHandler}
        />
      )}

      {showMessageModal && (
        <MessageModal message="Are you sure you want to delete this item?">
          <Button onClick={confirmToDeleteByUserHandler} action={"delete"}>
            Delete
          </Button>
          <Button onClick={cancelToDeleteByUserHandler} action={"cancel"}>
            Cancel
          </Button>
        </MessageModal>
      )}
    </>
  );
};

export default EditablePlaceItem;