import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const useLanguage = () => {
  const [language, setLanguage] = useState(() => {
    return Cookies.get("language") || "pt";
  });

  const changeLanguage = (lang) => {
    setLanguage(lang);
    Cookies.set("language", lang, { expires: 365 });
  };

  useEffect(() => {
    const langFromCookies = Cookies.get("language");
    if (langFromCookies) {
      setLanguage(langFromCookies);
    }
  }, []);

  return { language, changeLanguage };
};

export default useLanguage;
