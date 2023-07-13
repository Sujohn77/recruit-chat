// var guid = "FE10595F-12C4-4C59-8FAA-055BB0FCB1A6"; // James's guid
var guid = "f466faec-ea83-4122-8c23-458ab21e96be";

const refreshToken = (callback) => {
  fetch("https://qa-integrations.loopworks.com/api/chatbot/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ChatbotGuid: guid }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data?.errors) {
        console.log("data.errors[0]", data.errors[0]);
      } else {
        callback?.(data);
      }
    });
};

const appendChatBot = (style, token) => {
  const ifrm = document.createElement("iframe"),
    url_string = `https://loopchatbot.z14.web.core.windows.net`;
  ifrm.setAttribute("src", url_string);
  ifrm.setAttribute("id", "chat-iframe");
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
  ifrm.style.cssText = `position: fixed;
                    right: 10px;
                    bottom: 10px;
                    z-index: 2;
                    transition: all 0.5s ease-in-out;
                    border: none;
                    height: 601px;`;

  document.body.appendChild(ifrm);

  ifrm.addEventListener("load", () => {
    ifrm.contentWindow.postMessage({ guid, style, token }, ifrm.src);
  });
  ifrm.onerror = () => refreshToken();

  function onMessage(event) {
    if (
      url_string.indexOf(event.origin) !== -1 &&
      event.data.event_id === "refresh_token"
    ) {
      refreshToken(event.data.callback);
    }
  }

  if (window.addEventListener) {
    window.addEventListener("message", onMessage);
  } else {
    window.attachEvent("onmessage", onMessage); // IE8
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
    });
};

refreshToken(getChatBotStyle);
