import { Navbar } from "./components/Navbar";
import { Outlet, Route, Routes } from "react-router-dom";
import { PageSideborder } from "./components/PageSideborder";
import { IndexPage } from "./views/IndexPage";

const AppLayout = () => {
  return (
    <div className="h-vh w-full text-primary font-primary text-lg font-light bg-opacity-10">
      <Navbar />
      <PageSideborder />
      <Outlet />
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<IndexPage />} />
      </Route>
    </Routes>
  );
}

export default App;
