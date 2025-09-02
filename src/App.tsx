import "./index.css";
import AppRouter from "./AppRouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "./context/UserContext";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <AppRouter />
        <ReactQueryDevtools initialIsOpen={true} />
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
