// ----------------------------- CONSTANTS ----------------------------- //
// const guid = "FE10595F-12C4-4C59-8FAA-055BB0FCB1A6"; // 'qa' guid
// const guid = "9e2db3cf-238b-4182-980e-725e16699331"; // zustand
// const chatbotSrc = `http://zustand-chatbot.s3-website.eu-west-2.amazonaws.com`; // zustand
const guid = "f466faec-ea83-4122-8c23-458ab21e96be";
const chatbotSrc = "http://loop-chat-bot.s3-website.eu-west-2.amazonaws.com";

const BASE_URL = "https://qa-integrations.loopworks.com/api/chatbot";
const logStyle =
  "background-color: darkblue; color: white; font-style: italic; border: 5px solid hotpink; font-size: 1em; padding: 5px;";
const iframeID = "chat-iframe";
const loaderID = "_chat-bot-loader";
const loaderStyleId = "loader_style_id";

const eventIds = {
  REFRESH_TOKEN: "refresh_token",
  REFRESH_CHATBOT: "refresh_chatbot",
  IFRAME_HEIGHT: "iframe_height",
  GET_CHATBOT_DATA: "get_chatbot_data",
  HIDE_SPINNER: "hide_spinner",
};
// ---------------------------------------------------------------------- //
let chatBotToken;
let chatBotStyle;
let spinner;

function appendChatBot(style, token) {
  chatBotStyle = style;
  chatBotToken = token;

  const ifrm = document.createElement("iframe");
  ifrm.setAttribute("src", chatbotSrc);
  ifrm.setAttribute("id", iframeID);
  ifrm.setAttribute("width", "370px");
  ifrm.setAttribute(
    "sandbox",
    "allow-popups allow-popups-to-escape-sandbox allow-scripts allow-same-origin"
  );

  ifrm.sandbox.add(
    "allow-popups",
    "allow-popups-to-escape-sandbox",
    "allow-scripts",
    "allow-same-origin"
  );
  ifrm.style.cssText = `position: fixed;right: 10px; bottom: 10px; z-index: 2; transition: all 0.5s ease-in-out;border: none;`;

  document.body?.appendChild(ifrm);

  ifrm.addEventListener("load", () => {
    ifrm.contentWindow.postMessage({ guid, style, token }, ifrm.src);
  });
  ifrm.onerror = () => refreshToken();
}

async function refreshToken(callback) {
  try {
    const refreshRes = await fetch(`${BASE_URL}/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ChatbotGuid: guid.trim() }),
    });

    console.log(refreshRes, "refreshToken res");
    // if request was canceled
    if (refreshRes.status === null) {
      refreshToken(callback);
    }

    const data = await refreshRes.clone().json();

    if (data?.errors) {
      console.log(data.errors[0]);
      return Promise.reject(data.errors[0]);
    } else {
      callback && callback(data);
      return Promise.resolve(data);
    }
  } catch (error) {
    console.log("%cERROR", logStyle + "color: #d32f2f;", error);
    return Promise.reject(error);
  }
}

async function getChatBotStyle(token) {
  try {
    const response = await fetch(`${BASE_URL}/style?ChatBotGuid=` + guid);

    console.log(response, "getChatBotStyle res");
    // if request was canceled
    if (response.status === null) {
      getChatBotStyle(token);
    }

    const data = await response.clone().json();

    if (data?.statusCode === 413) {
      refreshToken(getChatBotStyle);
    } else {
      appendChatBot(JSON.parse(data), token);
    }
  } catch (error) {
    document.getElementById(loaderID)?.remove();
    document.getElementById(loaderStyleId)?.remove();
    spinner?.loader?.remove();
    spinner?.style?.remove();
    return Promise.reject(error);
  }
}

refreshToken(getChatBotStyle);

function onMessage(event) {
  if (chatbotSrc.indexOf(event.origin) !== -1 && event.data.event_id) {
    console.log("%cEVENT", logStyle, event);
    const chatbotIframe = document.getElementById(iframeID);

    switch (event.data.event_id) {
      case eventIds.REFRESH_TOKEN:
        refreshToken(event.data.callback)
          .then((data) => {
            if (data && chatbotIframe) {
              chatbotIframe.contentWindow.postMessage(
                { token: data },
                chatbotSrc
              );
            }
          })
          .catch(() => console.log("_ E R R O R _"));

        break;
      case eventIds.REFRESH_CHATBOT:
        console.log("%cREFRESH CHATBOT", logStyle);
        chatbotIframe?.remove();
        refreshToken(getChatBotStyle);
        break;
      case eventIds.IFRAME_HEIGHT:
        if (chatbotIframe && "isSelectedOption" in event.data) {
          chatbotIframe.style.height = event.data.isSelectedOption
            ? "601px"
            : "135px";
        }
        break;
      // this case for Safari (iframe.onload didn't work)
      case eventIds.GET_CHATBOT_DATA:
        chatbotIframe.contentWindow.postMessage(
          { guid, style: chatBotStyle, token: chatBotToken },
          chatbotSrc
        );
        break;

      case eventIds.HIDE_SPINNER:
        document.getElementById(loaderID)?.remove();
        document.getElementById(loaderStyleId)?.remove();
        spinner?.loader?.remove();
        spinner?.style?.remove();
        break;
      default:
        break;
    }
  }
}

function injectLoader() {
  const loader = document.createElement("span");
  loader.setAttribute("id", loaderID);
  loader.style.cssText = `
    position: fixed;
    right: 20px;
    bottom: 20px;
    z-index: 2;
    width: 48px;
    height: 48px;
    border: 5px solid #00b6ea;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    opacity: 0.7;
    `;

  const style = document.createElement("style");
  style.type = "text/css";
  style.id = loaderStyleId;
  style.innerHTML = `
    @keyframes rotation {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
    `;
  document?.body.appendChild(loader);
  document?.body.appendChild(style);

  // timeout in case of errors in the process of chatbot implementation
  setTimeout(() => {
    loader.remove();
    style.remove();
  }, 10000);

  return { loader, style };
}

if (window.addEventListener) {
  window.addEventListener("message", onMessage);
} else {
  window.attachEvent("onmessage", onMessage); // IE8
}

window.onload = () => {
  spinner = injectLoader();
};
