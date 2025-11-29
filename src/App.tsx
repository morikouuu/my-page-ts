import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/index";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import BlogAdmin from "./pages/Admin/index";
import CreateBlog from "./pages/Admin/Create";
import EditBlog from "./pages/Admin/Edit";
import BlogList from "./pages/BlogList";
import BlogDetail from "./pages/BlogDetail";
import Profile from "./pages/Profile";
import "./App.css";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<Layout />}>
					<Route path="/" element={<Home />} />
					<Route path="/contact" element={<Contact />} />
					<Route path="/blog" element={<BlogList />} />
					<Route path="/blog/:id" element={<BlogDetail />} />
					<Route path="/profile" element={<Profile />} />
					<Route path="*" element={<h1>Not Found Page</h1>} />
				</Route>

				{/* Layout外のページ（管理者用） */}
				<Route path="/login" element={<Login />} />
				<Route path="/admin/index" element={<BlogAdmin />} />
				<Route path="/admin/create" element={<CreateBlog />} />
				<Route path="/admin/edit/:id" element={<EditBlog />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
