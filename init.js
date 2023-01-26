var ifrm = document.createElement('iframe'),
  chatbotId = '32ea2d2b-f066-4358-b908-d3a779f588a0',
  url_string = `https://loopchatbot.z14.web.core.windows.net/?chatBotId=${chatbotId}`;
ifrm.setAttribute('src', url_string);
ifrm.setAttribute('id', 'chat-iframe');
ifrm.setAttribute('width', '370px');
ifrm.setAttribute('chatbotId', chatbotId);
ifrm.setAttribute('sandbox', 'allow-scripts allow-same-origin');
ifrm.style.cssText = `
        position: fixed;right: 10px; bottom: 10px; z-index: 2; transition: all 0.5s ease-in-out;border: none;height: 601px;
      `;

document.body.appendChild(ifrm),
  (doc = ifrm.contentWindow).document && (doc = doc.document);

var _timer = setInterval(function () {
  if ('complete' === doc.readyState) {
    clearInterval(_timer);
    var t,
      e = document.getElementById('chat-iframe'),
      i = window.addEventListener ? 'addEventListener' : 'attachEvent';
    (0, window[i])(
      'attachEvent' === i ? 'onmessage' : 'message',
      function (t) {
        console.log(t.data.height),
          t.data.height && (e.height = t.data.height + 'px');
      },
      !1
    );
  }
}, 1e3);

ifrm.addEventListener('load', () => {
  ifrm.contentWindow.postMessage(null, ifrm.src);
});
