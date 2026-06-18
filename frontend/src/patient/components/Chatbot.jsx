import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function Chatbot() {
  const location = useLocation();

  useEffect(() => {

    // لو صفحة Smart Assistant متعملش حاجة
    if (location.pathname.includes("smart-assistant") || location.pathname.includes("assistant")) {
      removeChatbot();
      return;
    }

    // يقفل الشات لو مفتوح عشان مايفضلش واخد مساحة لما يغير الصفحة
    if (window.chatbase && typeof window.chatbase === "function") {
      try {
        window.chatbase("close");
      } catch (e) {}
    }

    if (window.chatbase) return;


    const script = document.createElement("script");

    script.innerHTML = `
      (function(){
        if(!window.chatbase||window.chatbase("getState")!=="initialized"){
          window.chatbase=(...arguments)=>{
            if(!window.chatbase.q){window.chatbase.q=[]}
            window.chatbase.q.push(arguments)
          };

          window.chatbase=new Proxy(window.chatbase,{
            get(target,prop){
              if(prop==="q"){return target.q}
              return(...args)=>target(prop,...args)
            }
          })
        }

        const onLoad=function(){
          const script=document.createElement("script");
          script.src="https://www.chatbase.co/embed.min.js";
          script.id="R6TLm3ER5j0XAJ46ll2wO";
          script.domain="www.chatbase.co";
          document.body.appendChild(script);
        };

        onLoad();

      })();
    `;


    document.body.appendChild(script);

  }, [location.pathname]);

  // Global cleanup when leaving the patient portal
  useEffect(() => {
    return () => removeChatbot();
  }, []);

  return null;
}

function removeChatbot(){

  // يمسح كل عناصر Chatbase بس بيسيب الـ iframe بتاع صفحة Smart Assistant
  const elements = document.querySelectorAll(
    "iframe:not([src*='chatbot-iframe']), [id*='chatbase'], [class*='chatbase']"
  );

  elements.forEach(el => {
    el.remove();
  });


  // يمسح المتغير
  delete window.chatbase;

}


export default Chatbot;