import { useState } from "react";
import Cookies from "js-cookie";

const useLanguage = () => {
  const [language, setLanguage] = useState(() => {
    return Cookies.get("language") || "pt";
  });

  const changeLanguage = (lang) => {
    setLanguage(lang);
    Cookies.set("language", lang, { expires: 365 });
  };

  return { language, changeLanguage };
};

export default useLanguage;
