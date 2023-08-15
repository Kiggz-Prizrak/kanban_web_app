import { useSelector } from "react-redux";
import MoonIcon from "../assets/icons/MoonIcon";
import SunIcon from "../assets/icons/SunIcon";
import { useDispatch } from "react-redux";
import { editTheme } from "../store/kanbanSlice";

const DarkmodeButton = () => {
  const dispatch = useDispatch();

  const currentTheme = useSelector((state) => state.theme.currentTheme);
  // console.log(darkMode);


  return (
    <div className={`themeButton themeButton--${currentTheme}`}>
      {/* <div className={`darkmodeButton--${darkMode}`}> */}
      <SunIcon color="#828FA3" />

      <button
        // className={darkMode ? "darkmode_enabled" : "darkmode_disabled"}
        className={`${currentTheme}_enabled`}
        onClick={() => dispatch(editTheme())}
      >
        <span></span>
      </button>

      <MoonIcon color="#828FA3" />
    </div>
  );
};

export default DarkmodeButton;

//828FA3