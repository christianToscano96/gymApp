import type { User } from "@/preview/interfaces/preview.interfaces";
import { useState, useCallback } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Mail, Phone, SquarePen, Trash } from "lucide-react";
import Badge from "@/components/ui/badge";
import AlertDialog from "@/components/ui/alert-dialog";
import Modal from "@/components/ui/modal";
import { useQuery } from "@tanstack/react-query";
import { useCurrentUser } from "@/hook/useCurrentUser";

import { fetchUsers } from "@/api/userService";
import { AddUserForm } from "./AddUserForm";

import { formatDateES } from "@/lib/utils";

const UsersPage = () => {
  const [dialogState, setDialogState] = useState({
    openDialog: false,
    openViewUserModal: false,
    openFormNewUser: false,
    selectedUserId: "",
  });
  const [roleFilter, setRoleFilter] = useState<string>("user");
  const [searchTerm, setSearchTerm] = useState("");
  const { data: currentUser } = useCurrentUser();
  const roleTabs =
    currentUser?.role === "staff"
      ? [
          { label: "Todos", value: "all" },
          { label: "Usuarios", value: "user" },
          { label: "Entrenadores", value: "trainer" },
        ]
      : [
          { label: "Todos", value: "all" },
          { label: "Usuarios", value: "user" },
          { label: "Administradores", value: "administrator" },
          { label: "Personal", value: "staff" },
          { label: "Entrenadores", value: "trainer" },
        ];
  const {
    data: users,
    isLoading,
    refetch,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 5000,
  });

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const filteredUsers = (users || [])
    .filter((user: User) => {
      if (currentUser && currentUser.role === "staff") {
        if (roleFilter === "all") {
          return user.role === "user" || user.role === "trainer";
        }
        return user.role === roleFilter;
      }
      return roleFilter === "all" ? true : user.role === roleFilter;
    })
    .filter((user: User) => {
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.phone?.toLowerCase().includes(term)
      );
    });
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const deleteUser = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/users/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          const msg =
            data?.error || "No se pudo eliminar el usuario. Intenta de nuevo.";
          toast.error(msg);
          return;
        }
        toast.success("Usuario eliminado correctamente");
        refetch();
      } catch {
        toast.error("Error de red al eliminar usuario. Intenta más tarde.");
      }
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
    <main
      className="px-2 md:px-20 pt-4 md:pt-10 flex-1 mt-2 bg-white rounded-[20px] shadow-[0_4px_16px_rgba(17,17,26,0.05),0_8px_32px_rgba(17,17,26,0.05)]"
      role="main"
      aria-label="Gestión de usuarios"
    >
      <div
        className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center "
        role="region"
        aria-label="Barra de acciones de usuarios"
      >
        <h1 className="text-xl md:text-2xl font-bold" tabIndex={0}>
          Usuario
        </h1>
        <div className="w-full md:w-1/3" role="search">
          <Search
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {currentUser?.role === "administrator" && (
          <Button
            variant="default"
            className="w-full md:w-auto"
            onClick={handleOpenFormNewUser}
            aria-label="Agregar nuevo usuario"
          >
            Nuevo Usuario
          </Button>
        )}
      </div>

      <Tabs
        tabs={roleTabs}
        value={roleFilter}
        onChange={setRoleFilter}
        className="mt-4 md:mt-6 mb-2"
        aria-label="Filtrar por rol"
      />

      {isLoading && (
        <div className="mt-6 md:mt-10">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden" />
                <TableHead>Usuario</TableHead>
                <TableHead className="hidden md:table-cell">Contacto</TableHead>
                <TableHead className="hidden md:table-cell">Rol</TableHead>
                <TableHead className="hidden md:table-cell">Estado</TableHead>
                <TableHead className="hidden md:table-cell">
                  Fecha de Ingreso
                </TableHead>
                <TableHead>Fecha de Vencimiento</TableHead>
                <TableHead className="hidden md:table-cell">
                  Última Visita
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(6)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="hidden" />
                  <TableCell>
                    <Skeleton className="h-6 w-32" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-6 w-32" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-6 w-20" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-6 w-16" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-6 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-24" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-6 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <div
        className="w-full overflow-x-auto mt-6 md:mt-10 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <ScrollArea className="h-[calc(80vh-0px)] min-w-[350px] md:min-w-0">
          <Table
            className="min-w-[350px] md:min-w-0 text-xs md:text-sm"
            role="table"
            aria-label="Lista de usuarios"
          >
            <TableHeader>
              <TableRow>
                <TableHead className="hidden" />
                <TableHead>Usuario</TableHead>
                <TableHead className="hidden md:table-cell">Contacto</TableHead>
                <TableHead className="hidden md:table-cell">Rol</TableHead>
                <TableHead className="hidden md:table-cell">Estado</TableHead>
                <TableHead className="hidden md:table-cell">
                  Fecha de Ingreso
                </TableHead>
                <TableHead>Fecha de Vencimiento</TableHead>
                <TableHead className="hidden md:table-cell">
                  Última Visita
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user: User) => (
                <UserTableRow
                  key={user._id}
                  user={user}
                  onEdit={() => handleOpenViewUserModal(user._id)}
                  onDelete={() => handleOpenDialog(user._id)}
                />
              ))}
            </TableBody>
          </Table>
          {/* Paginación */}
          <div
            className="flex justify-center items-center gap-2 mt-4"
            role="navigation"
            aria-label="Paginación de usuarios"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Página anterior"
            >
              Anterior
            </Button>
            <span className="text-xs">
              Página {page} de {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
              aria-label="Página siguiente"
            >
              Siguiente
            </Button>
          </div>
          {dialogState.openDialog && (
            <AlertDialog
              isOpen={dialogState.openDialog}
              title="Eliminar usuario"
              description="¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer."
              confirmText="Eliminar"
              cancelText="Cancelar"
              onConfirm={async () => {
                await deleteUser(dialogState.selectedUserId);
                handleCloseDialog();
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
      </div>
    </main>
  );
};

const UserTableRow = ({
  user,
  onEdit,
  onDelete,
}: {
  user: User;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const { data: currentUser } = useCurrentUser();
  const canEdit =
    currentUser?.role === "administrator" ||
    (currentUser?.role === "staff" && ["user", "trainer"].includes(user.role));
  const canDelete = currentUser?.role === "administrator";
  return (
    <TableRow
      className="hover:bg-gray-50 text-xs md:text-sm h-12 md:h-auto "
      tabIndex={0}
      aria-label={`Usuario ${user.name}`}
    >
      <TableCell className="hidden" />
      <TableCell className="flex items-center gap-2 pt-2 md:pt-4">
        <Avatar
          size="sm"
          alt={user.name}
          src={user.avatar}
          className="text-xs"
        />
        {user.name}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <div>
          <div className="flex items-center gap-2 text-gray-500">
            <Mail className="w-3 h-3 text-gray-500" /> {user.email}
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Phone className="w-3 h-3 text-gray-500" /> {user.phone}
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">{user.role || "-"}</TableCell>
      <TableCell className="hidden md:table-cell">
        <Badge status={user.status}>{user.status}</Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell flex-1 text-gray-500 ">
        <div className="flex items-center gap-2">
          <Calendar className="w-3 h-3" /> {formatDateES(user.joinDate)}
        </div>
      </TableCell>
      {user.role !== "administrator" ? (
        (() => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          let isExpired = false;
          if (user.dueDate) {
            const due = new Date(user.dueDate);
            due.setHours(0, 0, 0, 0);
            isExpired = due < today;
          }
          return (
            <TableCell
              className={`flex-1 pb-2 md:pb-3 ${
                isExpired ? "text-red-500 font-bold" : "text-gray-500"
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3" /> {formatDateES(user.dueDate)}
              </div>
            </TableCell>
          );
        })()
      ) : (
        <TableCell className="flex-1  text-gray-500 pb-3">
          <div className="flex items-center gap-2"></div>
        </TableCell>
      )}
      <TableCell className="hidden md:table-cell flex-1  text-gray-500 pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-3 h-3" /> {formatDateES(user.lastVisit)}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {canEdit && (
            <button
              onClick={onEdit}
              aria-label={`Editar usuario ${user.name}`}
              tabIndex={0}
              className="focus:outline focus:ring-2 focus:ring-indigo-500 rounded"
              style={{
                background: "none",
                border: "none",
                padding: 0,
                margin: 0,
              }}
            >
              <SquarePen className="w-4 h-4 text-gray-500" />
            </button>
          )}
          {canDelete && (
            <button
              onClick={onDelete}
              aria-label={`Eliminar usuario ${user.name}`}
              tabIndex={0}
              className="focus:outline focus:ring-2 focus:ring-red-500 rounded"
              style={{
                background: "none",
                border: "none",
                padding: 0,
                margin: 0,
              }}
            >
              <Trash className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default UsersPage;
