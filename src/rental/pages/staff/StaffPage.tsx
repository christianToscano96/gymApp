import { Button } from "@/components/ui/button";
import CardItem from "@/components/ui/card-item";
import { Search } from "@/components/ui/search";
import { mockStaff } from "@/fake/fake-data-rental";
import { ScrollArea } from "@radix-ui/react-scroll-area";

const StaffPage = () => {
  return (
    <main className="p-4 flex-1 pl-10 pr-10 mt-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Staff</h1>
        <div className=" w-100">
          <Search />
        </div>
        <Button variant="default">Add Staff </Button>
      </div>
      <div className="mt-5 ">
        <ScrollArea className="h-[calc(80vh-0px)] p-10">
          {mockStaff.map((staff) => (
            <CardItem key={staff.id} data={staff} />
          ))}
        </ScrollArea>
      </div>
    </main>
  );
};

export default StaffPage;
