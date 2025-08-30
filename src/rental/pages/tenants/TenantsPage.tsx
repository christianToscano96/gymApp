import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "@/components/ui/search";
import { getTenants } from "@/fake/fake-data-rental";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import Avatar from "@/components/ui/avatar";
import { Calendar, Mail, Phone, SquarePen, Trash } from "lucide-react";
import Badge from "@/components/ui/badge";
import { useState } from "react";
import AlertDialog from "@/components/ui/alert-dialog";
import Modal from "@/components/ui/modal";
import { useQuery } from "@tanstack/react-query";
import { AddTenantForm } from "./AddTenantForm";

const TenantsPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewTenantModal, setOpenViewTenantModal] = useState(false);
  const [openFormNewTenant, setOpenFormNewTenant] = useState(false);

  const [getIdTenant, setGetIdTenant] = useState("");

  const { data: tenants, isLoading } = useQuery({
    queryKey: ["tenants"],
    queryFn: getTenants,
    staleTime: 1000 * 60 * 5,
  });

  console.log(getIdTenant);
  return (
    <main className="p-4 flex-1 pl-10 pr-10 mt-5">
      <div className="flex justify-between items-center ">
        <h1 className="text-2xl font-bold">Tenants</h1>
        <div className=" w-100">
          <Search />
        </div>
        <Button variant="default" onClick={() => setOpenFormNewTenant(true)}>
          Add Tenant
        </Button>
      </div>
      <ScrollArea className="h-[calc(80vh-0px)] p-10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Apartment</TableHead>
              <TableHead>Rent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Expiration</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenants?.map(
              ({
                id,
                name,
                apartment,
                rent,
                avatar,
                email,
                phone,
                status,
                dueDate,
              }) => (
                <TableRow key={id}>
                  <TableCell></TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Avatar
                      size="sm"
                      alt={name}
                      src={avatar}
                      className="text-xs"
                    />
                    {name}
                  </TableCell>
                  <TableCell>{apartment}</TableCell>
                  <TableCell>$ {rent}</TableCell>
                  <TableCell>
                    <Badge status={status}>{status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Mail className="w-3 h-3 text-gray-500" /> {email}
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Phone className="w-3 h-3 text-gray-500" /> {phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="w-3 h-3" /> {dueDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <SquarePen
                        className="w-4 h-4 text-gray-500"
                        onClick={() => {
                          setOpenViewTenantModal(true);
                          setGetIdTenant(id);
                        }}
                      />
                      <Trash
                        onClick={() => {
                          setOpenDialog(true);
                        }}
                        className="w-4 h-4 text-gray-500"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
        <AlertDialog
          isOpen={openDialog}
          title="Confirm Deletion"
          description="Are you sure you want to delete this tenant?"
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={() => {
            // Handle delete action
            setOpenDialog(false);
          }}
          onCancel={() => setOpenDialog(false)}
        />
        <Modal
          isOpen={openViewTenantModal}
          onClose={() => setOpenViewTenantModal(false)}
          title="View Tenant"
        >
          <AddTenantForm onSubmit={(tenant) => {}} id={getIdTenant} />
        </Modal>
        <Modal
          isOpen={openFormNewTenant}
          onClose={() => setOpenFormNewTenant(false)}
          title="Add Tenant"
        >
          <AddTenantForm onSubmit={(tenant) => {}} />
        </Modal>
      </ScrollArea>
    </main>
  );
};

export default TenantsPage;
