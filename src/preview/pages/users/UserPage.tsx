import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "@/components/ui/search";
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
import AlertDialog from "@/components/ui/alert-dialog";
import Modal from "@/components/ui/modal";
import { useQuery } from "@tanstack/react-query";
import { useCurrentUser } from "@/hook/useCurrentUser";

import { fetchUsers } from "@/api/userService";
import { AddUserForm } from "./AddUserForm";
import type { User } from "@/preview/interfaces/preview.interfaces";

const formatDate = (date?: string) => {
  if (!date) return "-";
  try {
    return new Date(date).toISOString().slice(0, 10);
  } catch {
    return "-";
  }
};

const UsersPage = () => {
  const [dialogState, setDialogState] = useState({
    openDialog: false,
    openViewUserModal: false,
    openFormNewUser: false,
    selectedUserId: "",
  });
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const { data: currentUser } = useCurrentUser();
  const roleTabs = [
    { label: "Todos", value: "all" },
    { label: "Usuarios", value: "user" },
    { label: "Administradores", value: "administrator" },
    { label: "Staff", value: "staff" },
  ];

  const {
    data: users,
    isLoading,
    refetch,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 5000, // Actualiza cada 5 segundos
  });

  const deleteUser = useCallback(
    async (id: string) => {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar usuario");
      toast.success("Usuario eliminado correctamente");
      refetch();
    },
    [refetch]
  );

  const handleOpenDialog = (id: string) =>
    setDialogState((s) => ({ ...s, openDialog: true, selectedUserId: id }));
  const handleOpenViewUserModal = (id: string) =>
    setDialogState((s) => ({
      ...s,
      openViewUserModal: true,
      selectedUserId: id,
    }));
  const handleCloseDialog = () =>
    setDialogState((s) => ({ ...s, openDialog: false }));
  const handleCloseViewUserModal = () =>
    setDialogState((s) => ({ ...s, openViewUserModal: false }));
  const handleOpenFormNewUser = () =>
    setDialogState((s) => ({ ...s, openFormNewUser: true }));
  const handleCloseFormNewUser = () =>
    setDialogState((s) => ({ ...s, openFormNewUser: false }));

  return (
    <main className="pl-20 pr-20 pt-10 flex-1 mt-2 bg-white rounded-[20px] shadow-[0_4px_16px_rgba(17,17,26,0.05),0_8px_32px_rgba(17,17,26,0.05)]">
      <div className="flex justify-between items-center ">
        <h1 className="text-2xl font-bold">Usuario</h1>
        <div className="w-100">
          <Search />
        </div>
        <Button variant="default" onClick={handleOpenFormNewUser}>
          Nuevo Usuario
        </Button>
      </div>
      {/* Tabs para filtrar por rol usando shadcn/ui */}
      {currentUser?.role === "administrator" && (
        <Tabs
          tabs={roleTabs}
          value={roleFilter}
          onChange={setRoleFilter}
          className="mt-6 mb-2"
        />
      )}

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
              <TableHead>Fecha de Ingreso</TableHead>
              <TableHead>Fecha de Vencimiento</TableHead>
              <TableHead>Última Visita</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users
              ?.filter((user: User) => {
                // Si el usuario logeado es staff, solo mostrar usuarios con rol 'user'
                if (currentUser && currentUser.role === "staff") {
                  return user.role === "user";
                }
                // Filtro normal por tabs
                return roleFilter === "all" ? true : user.role === roleFilter;
              })
              .map((user: User) => (
                <UserTableRow
                  key={user._id}
                  user={user}
                  onEdit={() => handleOpenViewUserModal(user._id)}
                  onDelete={() => handleOpenDialog(user._id)}
                />
              ))}
          </TableBody>
        </Table>
        {dialogState.openDialog && (
          <AlertDialog
            isOpen={dialogState.openDialog}
            title="Confirm Deletion"
            description="Are you sure you want to delete this user?"
            confirmText="Delete"
            cancelText="Cancel"
            onConfirm={async () => {
              await deleteUser(dialogState.selectedUserId);
              handleCloseDialog();
              refetch();
            }}
            onCancel={handleCloseDialog}
          />
        )}
        {dialogState.openViewUserModal && (
          <Modal
            isOpen={dialogState.openViewUserModal}
            onClose={handleCloseViewUserModal}
            title="View User"
          >
            <AddUserForm
              onClose={() => {
                handleCloseViewUserModal();
                refetch();
              }}
              id={dialogState.selectedUserId}
            />
          </Modal>
        )}
        {dialogState.openFormNewUser && (
          <Modal
            isOpen={dialogState.openFormNewUser}
            onClose={handleCloseFormNewUser}
            title="Add User"
          >
            <AddUserForm
              onClose={() => {
                handleCloseFormNewUser();
                refetch();
              }}
            />
          </Modal>
        )}
      </ScrollArea>
    </main>
  );
};

// Extrae la fila de usuario como componente
const UserTableRow = ({
  user,
  onEdit,
  onDelete,
}: {
  user: User;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <TableRow className="hover:bg-gray-50 ">
    <TableCell></TableCell>
    <TableCell className="flex items-center gap-2 pt-4">
      <Avatar size="sm" alt={user.name} src={user.avatar} className="text-xs" />
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
    <TableCell className="flex-1 text-gray-500 ">
      <div className="flex items-center gap-2">
        <Calendar className="w-3 h-3" /> {formatDate(user.joinDate)}
      </div>
    </TableCell>
    {user.role !== "administrator" ? (
      <TableCell className="flex-1  text-gray-500 pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-3 h-3" /> {formatDate(user.dueDate)}
        </div>
      </TableCell>
    ) : (
      <TableCell className="flex-1  text-gray-500 pb-3">
        <div className="flex items-center gap-2"></div>
      </TableCell>
    )}
    <TableCell className="flex-1  text-gray-500 pb-3">
      <div className="flex items-center gap-2">
        <Calendar className="w-3 h-3" /> {formatDate(user.lastVisit)}
      </div>
    </TableCell>
    <TableCell>
      <div className="flex items-center gap-2">
        <SquarePen className="w-4 h-4 text-gray-500" onClick={onEdit} />
        <Trash onClick={onDelete} className="w-4 h-4 text-gray-500" />
      </div>
    </TableCell>
  </TableRow>
);

export default UsersPage;
