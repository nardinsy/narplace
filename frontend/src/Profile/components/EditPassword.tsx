import { useState, MouseEvent, FC } from "react";
import Button from "../../shared-UI/Button";
import PasswordChangeModal from "./PasswordChangeModal";
import classes from "./ProfileEditForm.module.css";

interface EditPasswordT {
  changePassword: (newPAssword: string) => void;
}

const EditPassword: FC<EditPasswordT> = ({ changePassword }) => {
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const changePasswordHandler = (newPassword: string) => {
    changePassword(newPassword);
    //show message
  };

  const openChangePasswordModal = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowChangePasswordModal(true);
  };

  const closeChangePasswordModal = () => {
    setShowChangePasswordModal(false);
  };
  return (
    <>
      <Button
        type="submit"
        onClick={openChangePasswordModal}
        action={"edit"}
        className={classes.changePassword}
      >
        Change Password
      </Button>

      {showChangePasswordModal && (
        <PasswordChangeModal
          closeChangePasswordModal={closeChangePasswordModal}
          onPasswordChange={changePasswordHandler}
        />
      )}
    </>
  );
};

export default EditPassword;
