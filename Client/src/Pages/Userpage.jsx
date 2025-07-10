import { useOutletContext, useParams } from "react-router-dom";
import MyProfilePage from "../Components/MyProfilePage";
import UserProfilePage from "../Components/UserProfilePage";

function Userpage() {
  const user = useOutletContext();
  const { id: employeeId } = useParams();

  if (user.employeeId == employeeId) return <MyProfilePage />;

  return <UserProfilePage />;
}

export default Userpage;
