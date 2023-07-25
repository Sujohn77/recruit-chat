const guid = "f466faec-ea83-4122-8c23-458ab21e96be";
const url_string = `http://loop-chat-bot.s3-website.eu-west-2.amazonaws.com`;
const iframeID = "chat-iframe";

const appendChatBot = (style, token) => {
  const ifrm = document.createElement("iframe");

  ifrm.setAttribute("src", url_string);
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
  ifrm.style.cssText = `position: fixed;right: 10px; bottom: 10px; z-index: 2; transition: all 0.5s ease-in-out;border: none;height: 601px;`;

  document.body.appendChild(ifrm);

  ifrm.addEventListener("load", () => {
    ifrm.contentWindow.postMessage({ guid, style, token }, ifrm.src);
  });
  ifrm.onerror = () => refreshToken();
};

const refreshToken = async (callback) => {
  try {
    const refreshRes = await fetch(
      "https://qa-integrations.loopworks.com/api/chatbot/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ChatbotGuid: guid.trim() }),
      }
    );

    const data = await refreshRes.clone().json();

    if (data?.errors) {
      console.log(data.errors[0]);
      return Promise.reject(data.errors[0]);
    } else {
      callback && callback(data);
      return Promise.resolve(data);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

const getChatBotStyle = async (token) => {
  fetch(
    "https://qa-integrations.loopworks.com/api/chatbot/style?ChatBotGuid=" +
      guid
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.statusCode === 413) {
        refreshToken(getChatBotStyle);
      } else {
        appendChatBot(JSON.parse(data), token);
      }
    })
    .catch((error) => Promise.reject(error));
};

refreshToken(getChatBotStyle);

function onMessage(event) {
  if (url_string.indexOf(event.origin) !== -1 && event.data.event_id) {
    const chatbotIframe = document.getElementById(iframeID);

    switch (event.data.event_id) {
      case "refresh_token":
        refreshToken(event.data.callback)
          .then((data) => {
            if (data) {
              if (chatbotIframe) {
                chatbotIframe.contentWindow.postMessage(
                  { token: data },
                  url_string
                );
              }
            }
          })
          .catch(() => console.log("_ E R R O R _"));

        break;
      case "refresh_chatbot":
        console.log(
          "%cREFRESH CHATBOT",
          "background-color: darkblue; color: white; font-style: italic; border: 5px solid hotpink; font-size: 1em; padding: 5px;"
        );
        chatbotIframe?.remove();
        refreshToken(getChatBotStyle);
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
