// ----------------------------- CONSTANTS ----------------------------- //
// const guid = "FE10595F-12C4-4C59-8FAA-055BB0FCB1A6"; // JJ guid
// const guid = "9e2db3cf-238b-4182-980e-725e16699331"; // zustand
// const chatbotSrc = `http://zustand-chatbot.s3-website.eu-west-2.amazonaws.com`; // zustand
const guid = "f466faec-ea83-4122-8c23-458ab21e96be"; // qa guid
const chatbotSrc = "http://loop-chat-bot.s3-website.eu-west-2.amazonaws.com";

const BASE_URL = "https://qa-integrations.loopworks.com/api/chatbot";
const logStyle =
  "background-color: darkblue; color: white; font-style: italic; border: 5px solid hotpink; font-size: 1em; padding: 5px;";
const iframeID = "chat-iframe";

const eventIds = {
  REFRESH_TOKEN: "refresh_token",
  REFRESH_CHATBOT: "refresh_chatbot",
  IFRAME_HEIGHT: "iframe_height",
  GET_CHATBOT_DATA: "get_chatbot_data",
};
// ---------------------------------------------------------------------- //
let chatBotToken;
let chatBotStyle;
let chatBotProps;
let chatBotCompanyName;
let chatBotReferralListDomain;
let chatBotClientApiToken;

function appendChatBot(
  style,
  token,
  props,
  companyName,
  referralListDomain,
  clientApiToken
) {
  chatBotStyle = style;
  chatBotProps = props;
  chatBotToken = token;
  chatBotCompanyName = companyName;
  chatBotReferralListDomain = referralListDomain;
  chatBotClientApiToken = clientApiToken;

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
    ifrm.contentWindow.postMessage(
      { guid, style, token, hostname: window.location.hostname },
      ifrm.src
    );
    ifrm.contentWindow.postMessage(
      {
        guid,
        style,
        token,
        props,
        companyName,
        referralListDomain,
        clientApiToken,
        hostname: window.location.hostname,
      },
      ifrm.src
    );
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

    // if request was canceled
    if (refreshRes.status === null) {
      refreshToken(callback);
    }

    const data = await refreshRes.clone().json();

    console.log("refreshToken RES", data);
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
    const response = await fetch(
      `${BASE_URL}/configuration/?chatBotGuid=${guid}`
    );

    // if request was canceled
    if (response.status === null) {
      getChatBotStyle(token);
    }

    const data = await response.clone().json();

    if (data?.statusCode === 413) {
      refreshToken(getChatBotStyle);
    } else {
      appendChatBot(
        data.style,
        token,
        data.props,
        data.props.companyName,
        data.props.referralListDomain,
        data.props.clientApiToken
      );
    }
  } catch (error) {
    return Promise.reject(error);
  }
}

refreshToken(getChatBotStyle);

function onMessage(event) {
  // console.log("%cEVENT", logStyle, event);
  if (chatbotSrc.indexOf(event.origin) !== -1 && event.data.event_id) {
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
          .catch((error) => console.log("error", error));

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
      case eventIds.GET_CHATBOT_DATA:
        // this case for Safari (iframe.onload didn't work)
        chatbotIframe.contentWindow.postMessage(
          {
            guid,
            style: chatBotStyle,
            token: chatBotToken,
            props: chatBotProps,
            companyName: chatBotCompanyName,
            referralListDomain: chatBotReferralListDomain,
            clientApiToken: chatBotClientApiToken,
          },
          chatbotSrc
        );
        break;

      default:
        break;
    }
  }
}

if (window.addEventListener) {
  window.addEventListener("message", onMessage);
} else {
  window.attachEvent("onmessage", onMessage); // IE8
}
