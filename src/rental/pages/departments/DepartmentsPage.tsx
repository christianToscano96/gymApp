import { Button } from "@/components/ui/button";
import CardApartment from "@/components/ui/card-apartment";
import { Search } from "@/components/ui/search";
import { getDepartments } from "@/fake/fake-data-rental";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useQuery } from "@tanstack/react-query";

const DepartmentsPage = () => {
  const { data: departments, isLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <main className="p-4 flex-1 pl-10 pr-10 mt-5">
          <div className="flex justify-between items-center pb-4">
            <h1 className="text-2xl font-bold">Departments</h1>
            <div className=" w-100">
              <Search />
            </div>
            <Button variant="default">Add Departments </Button>
          </div>
          <ScrollArea>
            <div className="grid grid-cols-3 gap-4 h-[calc(80vh-0px)] p-10 overflow-auto">
              {departments?.map((apartment) => (
                <CardApartment key={apartment.id} apartment={apartment} />
              ))}
            </div>
          </ScrollArea>
        </main>
      )}
    </>
  );
};

export default DepartmentsPage;
