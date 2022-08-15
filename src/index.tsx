import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { useApiKey } from "utils/hooks";
import "./index.css";
import {api} from "./utils/api";
// import "./firebase/config";
// import App from "./App";

function Test() {
  const apiKey: any = useApiKey();
  const [botData, setBotData] = React.useState();
  const [style, setStyle] = React.useState({
    color: "#000",
    backgroundColor: "#fff",
    backgroundImage: "none",
  });

  useEffect(() => {
   if(apiKey) {
     api.test(apiKey).then(res => {
       console.log('Bot data: ', res.data);
       setBotData(res.data);
       setStyle({
         color: res.data.fontColor,
         backgroundColor: res.data.backgroundColor,
         backgroundImage: `url("${res.data.imageUrl}")`,
       })
     });
   }
  }, [apiKey]);

  return (
    <div style={{...style, width: '250px'}}>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        Atque culpa cumque dolore ea et inventore labore possimus, qui
        vel voluptas! A aliquid culpa facilis iusto mollitia nemo nulla
        praesentium. Dignissimos. Aliquid amet aspernatur cupiditate distinctio dolore enim
        error illum, minus mollitia necessitatibus nobis non officia
        perferendis rem repellat suscipit ut. Architecto asperiores
        aspernatur cumque enim in inventore ratione ut, voluptatum?
    </div>
  )
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
// root.render(<App />);
root.render(<Test />);
