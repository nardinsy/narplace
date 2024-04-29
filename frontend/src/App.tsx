import React from "react";
import { Route } from "react-router-dom";
import MainHeader from "./Header/MainHeader";
import AuthForms from "./Authentication/AuthForm";
import Authorized from "./Profile/Authorized";
import AnyUserPlaces from "./user/pages/AnyUserPlaces";
import PlacePage from "./places/pages/PlacePage";
import Users from "./user/pages/Users";
import useRequireAuthContext from "./Hooks/useRequireAuthContext";

const App: React.FC = (porps) => {
  const authContext = useRequireAuthContext();

  return (
    <>
      <MainHeader />

      <Route path="/" exact>
        <Users />
      </Route>

      <Route path="/login">
        <AuthForms title={"Login"} />
      </Route>

      <Route path="/signup">
        <AuthForms title={"Signup"} />
      </Route>

      <Route path="/places/:userId" exact>
        <AnyUserPlaces />
      </Route>

      <Route path="/place/:placeId" exact>
        <PlacePage />
      </Route>

      {authContext.isLoggedin && <Authorized token={authContext.token!} />}
    </>
  );
};

export default App;
