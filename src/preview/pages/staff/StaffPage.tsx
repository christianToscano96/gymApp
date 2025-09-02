import { Button } from "@/components/ui/button";
import { Search } from "@/components/ui/search";
import { mockStaff } from "@/fake/fake-data-gym";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge";
import { Mail, Phone, SquarePen, Trash } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Avatar from "@/components/ui/avatar";
import { useState } from "react";
import Modal from "@/components/ui/modal";
import AlertDialog from "@/components/ui/alert-dialog";

const StaffPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewStaffModal, setOpenViewStaffModal] = useState(false);
  const [openFormNewStaff, setOpenFormNewStaff] = useState(false);
  const [getIdStaff, setGetIdStaff] = useState("");

  return (
    <main className="p-4 flex-1 pl-10 pr-10 mt-5">
      <div className="flex justify-between items-center ">
        <h1 className="text-2xl font-bold">Staff</h1>
        {getIdStaff}
        <div className=" w-100">
          <Search />
        </div>
        <Button variant="default" onClick={() => setOpenFormNewStaff(true)}>
          Add Staff
        </Button>
      </div>
      <ScrollArea className="h-[calc(80vh-0px)] p-10">
        <Table className="w-full pl-4 ">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockStaff.map(
              ({ id, avatar, name, role, status, email, phone }) => (
                <TableRow key={id}>
                  <TableCell className="flex items-center gap-3">
                    <Avatar size="sm" src={avatar} alt={name} />
                    {name}
                  </TableCell>
                  <TableCell>{role}</TableCell>
                  <TableCell>
                    <Badge status={status}>{status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-gray-500">
                      <span className="flex items-center gap-2">
                        <Mail className="w-3 h-3" /> {email}
                      </span>
                      <span className="flex items-center gap-2">
                        <Phone className="w-3 h-3" /> {phone}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <SquarePen
                        className="w-4 h-4 text-gray-500"
                        onClick={() => {
                          setOpenViewStaffModal(true);
                          setGetIdStaff(id);
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
          isOpen={openViewStaffModal}
          onClose={() => setOpenViewStaffModal(false)}
          title="View Staff"
        >
          hola{" "}
        </Modal>
        <Modal
          isOpen={openFormNewStaff}
          onClose={() => setOpenFormNewStaff(false)}
          title="Add Staff"
        >
          hola{" "}
        </Modal>
      </ScrollArea>
    </main>
  );
};

export default StaffPage;
