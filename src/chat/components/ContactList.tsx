import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { getClients } from "@/fake/fake-data";
import { NavLink, useParams } from "react-router";

const ContactList = () => {
  const { clientId } = useParams();
  console.log(clientId);

  const { data: clients, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <ScrollArea className="h-[calc(100vh-120px)]">
      <div className="space-y-4 p-4">
        <div className="space-y-1">
          <h3 className="px-2 text-sm font-semibold">Contacts</h3>

          {isLoading ? (
            <div className="space-y-1">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="space-y-1">
              {clients?.map((client) => (
                <NavLink
                  to={`/chat/${client.id}`}
                  key={client.id}
                  className={({ isActive }) =>
                    `w-full justify-start flex transition-all duration-300 ${
                      isActive
                        ? "bg-primary/10 text-white shadow-md p-1 rounded-md transition-all duration-200"
                        : "bg-transparent hover:bg-primary/10 transition-all duration-200"
                    }`
                  }
                >
                  <div
                    className={`h-6 w-6 rounded-full mr-2 flex-shrink-0 flex items-center justify-center text-xs ${
                      clientId === client.id
                        ? "bg-blue-300 text-blue-800"
                        : "bg-gray-300"
                    }`}
                  >
                    {client.name.charAt(0)}
                    {client.name.charAt(1)}
                  </div>
                  <span
                    className={`transition-all duration-300 ${
                      clientId === client.id ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {client.name}
                  </span>
                </NavLink>
              ))}
            </div>
          )}
        </div>
        <div className="pt-4 border-t mt-4">
          <h3 className="px-2 text-sm font-semibold mb-1">Recent</h3>
          <Button variant="ghost" className="w-full justify-start">
            <div className="h-6 w-6 rounded-full bg-gray-500 mr-2 flex-shrink-0 flex items-center justify-center text-white text-xs">
              TM
            </div>
            Thomas Miller
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <div className="h-6 w-6 rounded-full bg-red-500 mr-2 flex-shrink-0 flex items-center justify-center text-white text-xs">
              SB
            </div>
            Sarah Brown
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
};

export default ContactList;
