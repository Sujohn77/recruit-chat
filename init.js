const appendChatBot = (style) => {
    const ifrm = document.createElement('iframe'),
        chatbotId = '32ea2d2b-f066-4358-b908-d3a779f588a0',
        url_string = `https://loopchatbot.z14.web.core.windows.net/?chatBotId=${chatbotId}`;
    ifrm.setAttribute('src', url_string);
    ifrm.setAttribute('id', 'chat-iframe');
    ifrm.setAttribute('width', '370px');
    ifrm.setAttribute('style', style);
    ifrm.setAttribute('sandbox', 'allow-scripts allow-same-origin');

    ifrm.style.cssText = `
        position: fixed;right: 10px; bottom: 10px; z-index: 2; transition: all 0.5s ease-in-out;border: none;height: 601px;
      `;

    document.body.appendChild(ifrm);

    ifrm.addEventListener('load', () => {
        ifrm.contentWindow.postMessage(null, ifrm.src);
    });
    ifrm.onerror = refreshToken;
};

let jwtToken;
const refreshToken = async () => {
    try {
        const response = await fetch('api/chatbot/token');
        console.log(response);
        jwtToken = response.token;
    } catch (err) {
        if (err.httpStatusCode === 403) {
            console.log(err);
        }
    }
};

const getChatBotStyle = async () => {
    const body = { ChatBotGUID: 'xxxx' };
    const headers = jwtToken ? { Authentication: `Bearer ${jwtToken}` } : {};
    try {
        const response = await fetch('api/chatbot/style', { body, headers });
        console.log(response);
        appendChatBot(response.style);
    } catch (err) {
        if (err.httpStatusCode === 403) {
            console.log(err);
        }
    }
};
debugger;
getChatBotStyle();
