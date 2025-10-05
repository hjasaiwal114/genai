import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export const AppContext = createContext();
const AppContextProvider = (props) => {
  const [user, setuser] = useState(null);
  const [showLogin, setshowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [credit, setCredit] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const loadCreditsData = async () => {//Fetches the latest user credits from the backend.
    if (!user) return;
    try {
      const { data } = await axios.get(backendUrl + "/api/user/credits", {
        headers: { token },
        data: { userId: user._id },
      });
      if (data.success) {
        setCredit(data.credits);
        setuser(data.user);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  const generateImage = async (prompt) => { //Sends a request to backend to generate an image
    try {
      const { data } = await axios.post(
        backendUrl + "/api/image/generate-image",
        { prompt },
        { headers: { token } }
      );

      if (data.success) {
        loadCreditsData();
        return data.resultImage;
      } else {
        toast.error(data.message);
        loadCreditsData();//update credit after uses
        if (data.creditBalance === 0) {
          navigate("/buy");
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setuser(null);
  };

  useEffect(() => {
    if (token) {
      loadCreditsData();
    }
  }, [token]);

  const value = {
    user,
    setuser,
    showLogin,
    setshowLogin,
    backendUrl,
    credit,
    setCredit,
    token,
    setToken,
    loadCreditsData,
    logout,
    generateImage,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
export default AppContextProvider;
