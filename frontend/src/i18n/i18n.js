// import i18n from "i18next";
// import { initReactI18next } from "react-i18next";

// import translationEN from "./locales/en/translation.json";
// import translationAR from "./locales/ar/translation.json";

// // إعداد الترجمات
// const resources = {
//   en: { translation: translationEN },
//   ar: { translation: translationAR },
// };

// i18n
//   .use(initReactI18next)
//   .init({
//     resources,
//     lng: "en", // اللغة الافتراضية
//     fallbackLng: "en",
//     interpolation: { escapeValue: false },
//   });

// export default i18n;


import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import translationEN from "./locales/en/translation.json";
import translationAR from "./locales/ar/translation.json";

// 👇 نقرأ اللغة من localStorage أو نخليها إنجليزي افتراضياً
const savedLanguage = localStorage.getItem("appLanguage") || "en";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: translationEN },
      ar: { translation: translationAR },
    },
    lng: savedLanguage, // ✅ استخدم اللغة المخزنة
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
