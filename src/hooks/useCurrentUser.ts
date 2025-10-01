import { useQuery } from "@tanstack/react-query";
import { fetchUserById } from "@/api/userService";

// Simulación: obtener el id del usuario logeado desde localStorage
function getLoggedUserId() {
  return localStorage.getItem("userId");
}

export function useCurrentUser() {
  const userId = getLoggedUserId();
  return useQuery({
    queryKey: ["currentUser", userId],
    queryFn: () => fetchUserById(userId!),
    enabled: !!userId,
  });
}
