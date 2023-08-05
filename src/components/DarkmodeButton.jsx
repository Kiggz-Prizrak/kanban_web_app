import { useSelector } from "react-redux";
import MoonIcon from "../assets/icons/MoonIcon";
import SunIcon from "../assets/icons/SunIcon";
import { useDispatch } from "react-redux";
import { editDarkmode } from "../store/kanbanSlice";

const DarkmodeButton = () => {
  const dispatch = useDispatch();

  const darkMode = useSelector((state) => state.darkMode);
  // console.log(darkMode);

  return (
    <div className="darkmodeButton">
      <SunIcon />

      <button
        className={darkMode ? "darkmode_enabled" : "darkmode_disabled"}
        onClick={() => dispatch(editDarkmode())}
      >
        <span></span>
      </button>

      <MoonIcon />
    </div>
  );
};

export default DarkmodeButton;
