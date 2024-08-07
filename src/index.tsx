import React from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import App from "./app/App";
import {store} from "app/store";
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";

const rerenderEntireTree = () => {
    const root = createRoot(document.getElementById("root") as HTMLElement);
    root.render(
        <BrowserRouter>
            <Provider store={store}>
                <App/>
            </Provider>
        </BrowserRouter>
    );
}
rerenderEntireTree()
