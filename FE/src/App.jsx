import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import GlobalNotification from "./components/Notification/GlobalNotification";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <GlobalNotification />
    </BrowserRouter>
  );
}

export default App;
