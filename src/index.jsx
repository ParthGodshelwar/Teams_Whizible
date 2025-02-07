import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
// import "./index.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import * as serviceWorker from "./serviceWorker";
import App from "./app/App";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translations
import translations_en from "./locales/en/translation.json"; // English translations
import translations_fr from "./locales/fr/translation.json";
import translations_mr from "./locales/mr/translation.json";
// third party style
import "perfect-scrollbar/css/perfect-scrollbar.css";

const root = createRoot(document.getElementById("root"));
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: { translation: translations_en },
      fr: { translation: translations_fr },
      mr: { translation: translations_mr }
      // Add resources for other languages here
    },
    lng: "en", // default language
    fallbackLng: "en", // fallback language if a translation is missing
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// for IE-11 support un-comment cssVars() and it's import in this file
// and in WhizTheme file

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
