import React, {StrictMode} from "react";
import {createRoot} from 'react-dom/client';
import App from './screen/App'
import ClickAudioProvider from "./components/ClickAudioProvider";

// 👇️ make sure to use the correct root element ID
// from your public/index.html file
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
	<StrictMode>
	<ClickAudioProvider>
		<App />
	</ClickAudioProvider>		
	</StrictMode>
);
