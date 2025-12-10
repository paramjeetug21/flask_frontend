import DashBoardWithoutToken from "../components/DashBoardWithoutLogic";
import DashBoardWithToken from "../components/DashBoardWithToken";

export default function DashBoard() {
  const token = localStorage.getItem("token");
  return <>{token ? <DashBoardWithToken /> : <DashBoardWithoutToken />}</>;
}
