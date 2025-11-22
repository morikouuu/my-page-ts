import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/index";
import Home from "./pages/Home";

import "./App.css";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<Layout />}>
					<Route path="/" element={<Home />} />

					<Route path="*" element={<h1>Not Found Page</h1>} />
					{/* 404ページ */}
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
