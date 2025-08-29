import { Button } from "@/components/ui/button";
import CardItem from "@/components/ui/card-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "@/components/ui/search";
import { mockTenants } from "@/fake/fake-data-rental";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";

const TenantsPage = () => {
  return (
    <main className="p-4 flex-1 pl-10 pr-10 mt-5">
      <div className="flex justify-between items-center ">
        <h1 className="text-2xl font-bold">Tenants</h1>
        <div className=" w-100">
          <Search />
        </div>
        <Button variant="default">Add Tenant</Button>
      </div>
      <div className="mt-5 ">
        <ScrollArea className="h-[calc(80vh-0px)] p-10">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell>{tenant.name}</TableCell>
                  <TableCell>{tenant.email}</TableCell>
                  <TableCell>{tenant.phone}</TableCell>
                  <TableCell>{tenant.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </main>
  );
};

export default TenantsPage;
