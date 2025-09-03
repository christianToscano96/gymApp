import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "@/components/ui/search";
// import { getUsers } from "@/fake/fake-data-gym";
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
import { AddUserForm } from "./AddUserForm";

const UsersPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewUserModal, setOpenViewUserModal] = useState(false);
  const [openFormNewUser, setOpenFormNewUser] = useState(false);

  const [getIdUser, setGetIdUser] = useState("");

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    if (!res.ok) throw new Error("Error al obtener usuarios");
    return res.json();
  };

  type User = {
    id: string;
    name: string;
    avatar?: string;
    email: string;
    phone: string;
    status: string;
    //membership: string;
    lastVisit: string;
    role: string;
  };

  const {
    data: users,
    isLoading,
    refetch,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5,
  });

  console.log(users);
  return (
    <main className="pl-20 pr-20 pt-10 flex-1 mt-5 bg-white rounded-[20px] shadow-[0_4px_16px_rgba(17,17,26,0.05),0_8px_32px_rgba(17,17,26,0.05)]">
      <div className="flex justify-between items-center ">
        <h1 className="text-2xl font-bold">Usuario</h1>
        <div className=" w-100">
          <Search />
        </div>
        <Button variant="default" onClick={() => setOpenFormNewUser(true)}>
          Nuevo Usuario
        </Button>
      </div>
      {isLoading && <div>Loading...</div>}
      <ScrollArea className="h-[calc(80vh-0px)] mt-10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Última Visita</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user: User) => (
              <TableRow key={user.id} className="hover:bg-gray-50 ">
                <TableCell></TableCell>
                <TableCell className="flex items-center gap-2 pt-4">
                  <Avatar
                    size="sm"
                    alt={user.name}
                    src={user.avatar}
                    className="text-xs"
                  />
                  {user.name}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Mail className="w-3 h-3 text-gray-500" /> {user.email}
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Phone className="w-3 h-3 text-gray-500" /> {user.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.role || "-"}</TableCell>

                <TableCell>
                  <Badge status={user.status}>{user.status}</Badge>
                </TableCell>
                <TableCell className="flex items-center gap-2 text-gray-500 pb-3">
                  <Calendar className="w-3 h-3" /> {user.lastVisit}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <SquarePen
                      className="w-4 h-4 text-gray-500"
                      onClick={() => {
                        setOpenViewUserModal(true);
                        setGetIdUser(user.id);
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
            ))}
          </TableBody>
        </Table>
        <AlertDialog
          isOpen={openDialog}
          title="Confirm Deletion"
          description="Are you sure you want to delete this user?"
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={() => {
            setOpenDialog(false);
          }}
          onCancel={() => setOpenDialog(false)}
        />
        <Modal
          isOpen={openViewUserModal}
          onClose={() => {
            setOpenViewUserModal(false);
            refetch();
          }}
          title="View User"
        >
          <AddUserForm onSubmit={() => { refetch(); }} id={getIdUser} />
        </Modal>
        <Modal
          isOpen={openFormNewUser}
          onClose={() => {
            setOpenFormNewUser(false);
            refetch();
          }}
          title="Add User"
        >
          <AddUserForm onSubmit={() => { refetch(); }} id="" />
        </Modal>
      </ScrollArea>
    </main>
  );
};

export default UsersPage;
