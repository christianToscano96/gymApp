import React, { useState, useEffect, useCallback, useMemo } from "react";
import { io } from "socket.io-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/hook/useCurrentUser";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "@/preview/interfaces/preview.interfaces";
import { Mail, Phone, UserRoundCog, X } from "lucide-react";
import { fetchUsers } from "@/api/userService";
import { saveTrainerTrainees } from "@/api/trainerService";

const TrainerPreviewPage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();
  const { data: trainer, isLoading, error } = useCurrentUser();
  const [viewProfile, setViewProfile] = useState(false);
  const [showAddTrainee, setShowAddTrainee] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [showTraineeTable, setShowTraineeTable] = useState(false);


  const { data: traineeUsers, refetch: refetchTrainees } = useQuery({
    queryKey: ["trainerTrainees", trainer?._id],
    queryFn: async () => {
      if (
        !trainer?.trainerData?.trainees ||
        trainer.trainerData.trainees.length === 0
      )
        return [];
      // Obtener los datos completos de los trainees
      const allUsers = await fetchUsers();
      return allUsers.filter((u: User) =>
        trainer.trainerData.trainees.includes(u._id)
      );
    },
    enabled: !!trainer?.trainerData?.trainees,
  });

  // Mantener la instancia de socket y escuchar solo una vez
  useEffect(() => {
    const socket = io("http://localhost:5050");
    const handleTraineesUpdated = (data: { trainerId: string }) => {
      if (data.trainerId === trainer?._id) {
        refetchTrainees();
      }
    };
    socket.on("traineesUpdated", handleTraineesUpdated);
    return () => {
      socket.off("traineesUpdated", handleTraineesUpdated);
      socket.disconnect();
    };
  }, [trainer?._id, refetchTrainees]);

  // Refetch trainees when trainer changes (e.g., after add/remove)
  useEffect(() => {
    if (trainer?._id) {
      refetchTrainees();
    }
  }, [trainer?._id, refetchTrainees]);

  // Obtener usuarios dinámicamente desde el servicio y asegurar el campo 'role'
  const fetchUsersFromService = useCallback(async () => {
    try {
      const data: User[] = await fetchUsers();
      const mappedUsers: User[] = data.map((u) => ({
        _id: u._id ?? "",
        name: u.name ?? "",
        email: u.email ?? "",
        avatar: u.avatar,
        phone: u.phone ?? "",
        trainerData: u.trainerData,
        role: u.role,
        status: u.status ?? "Pendiente",
        membership: u.membership ?? "Básico",
        lastVisit: u.lastVisit ?? "",
        joinDate: u.joinDate ?? "",
        dueDate: u.dueDate ?? "",
        qrCode: u.qrCode ?? "",
        qrImage: u.qrImage,
        password: u.password ?? "",
        dni: u.dni ?? "",
      }));
      setUsers(mappedUsers);
    } catch {
      setUsers([]);
    }
  }, []);

  // Abrir modal y cargar usuarios
  const handleOpenAddTrainee = useCallback(() => {
    setShowAddTrainee(true);
    fetchUsersFromService();
  }, [fetchUsersFromService]);

  const handleAddTrainees = useCallback(async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    const newTrainees = users.filter((u) => selectedUserIds.includes(u._id));
    setShowAddTrainee(false);
    setSelectedUserIds([]);
    try {
      const currentTrainees = trainer.trainerData?.trainees || [];
      const allIds = [...currentTrainees, ...newTrainees.map((t) => t._id)];
      const uniqueIds = Array.from(new Set(allIds));
      await saveTrainerTrainees(trainer._id, uniqueIds);
      const loggedUserId = localStorage.getItem("userId");
      await queryClient.invalidateQueries({
        queryKey: ["trainerTrainees", trainer?._id],
      });
      await queryClient.invalidateQueries({
        queryKey: ["currentUser", loggedUserId],
      });
      await refetchTrainees();
    } catch (err) {
      console.error("Error al agregar trainees:", err);
    }
    setIsProcessing(false);
  }, [
    isProcessing,
    users,
    selectedUserIds,
    trainer,
    queryClient,
    refetchTrainees,
  ]);

  const handleRemoveTrainee = useCallback(
    async (traineeId: string) => {
      if (isProcessing) return;
      setIsProcessing(true);
      try {
        const updatedIds = (traineeUsers || [])
          .filter((t: User) => t._id !== traineeId)
          .map((t: User) => t._id);
        await saveTrainerTrainees(trainer._id, updatedIds);
        const loggedUserId = localStorage.getItem("userId");
        await queryClient.invalidateQueries({
          queryKey: ["trainerTrainees", trainer?._id],
        });
        await queryClient.invalidateQueries({
          queryKey: ["currentUser", loggedUserId],
        });
        await refetchTrainees();
      } catch (err) {
        console.error("Error al eliminar trainee:", err);
      }
      setIsProcessing(false);
    },
    [isProcessing, traineeUsers, trainer, queryClient, refetchTrainees]
  );
  // Memoized filtered users for modal
  const availableUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.role === "user" &&
        !(traineeUsers || []).some((t: User) => t._id === user._id)
    );
  }, [users, traineeUsers]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-lg">Cargando...</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-lg text-red-500">Error al cargar el usuario</span>
      </div>
    );
  }
  if (!trainer || trainer.role !== "trainer") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-lg">No eres un trainer</span>
      </div>
    );
  }

  // Internal component for AddTraineeModal
  const AddTraineeModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-lg font-bold mb-4">
          Selecciona usuarios para agregar
        </h2>
        <div className="max-h-64 overflow-y-auto mb-4">
          {availableUsers.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No hay usuarios disponibles
            </p>
          ) : (
            availableUsers.map((user) => {
              const checked = selectedUserIds.includes(user._id);
              return (
                <label
                  key={user._id}
                  className="flex items-center gap-2 py-2 border-b last:border-b-0"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      if (checked) {
                        setSelectedUserIds((prev) =>
                          prev.filter((id) => id !== user._id)
                        );
                      } else {
                        setSelectedUserIds((prev) => [...prev, user._id]);
                      }
                    }}
                  />
                  <Avatar
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name}
                  />
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </label>
              );
            })
          )}
        </div>
        <div className="flex gap-2 justify-end">
          <button
            className="px-4 py-2 rounded-lg bg-muted text-foreground hover:bg-muted/80"
            onClick={() => setShowAddTrainee(false)}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/80 disabled:opacity-50"
            onClick={handleAddTrainees}
            disabled={selectedUserIds.length === 0 || isProcessing}
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );

  // Internal component for TraineeTable
  const TraineeTable = () => (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">Trainees seleccionados</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {traineeUsers.map((trainee: User) => (
          <div
            key={trainee._id}
            className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
          >
            <Avatar
              src={trainee.avatar || "/placeholder.svg"}
              alt={trainee.name}
            />
            <span className="font-medium">{trainee.name}</span>
            <span className="text-xs text-muted-foreground">
              {trainee.email}
            </span>
            <button
              className="ml-auto px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
              onClick={() => handleRemoveTrainee(trainee._id)}
              disabled={isProcessing}
            >
              Eliminar
            </button>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  // Internal component for TrainerProfile
  const TrainerProfile = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <UserRoundCog className="h-5 w-5 text-primary" />
          Información del Trainer
          <div className="ml-auto cursor-pointer hover:text-red-500 justify-end">
            <X onClick={() => setViewProfile(false)} />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium text-foreground">{trainer.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Teléfono</p>
            <p className="font-medium text-foreground">{trainer.phone}</p>
          </div>
        </div>
        {trainer.trainerData && (
          <div className="flex flex-col gap-2 p-3 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground">Especialidad</p>
            <p className="font-medium text-foreground">
              {trainer.trainerData.specialty}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-md space-y-4">
        <div className="flex items-center gap-4 p-6 bg-white rounded-3xl border border-gray-200  backdrop-blur-sm">
          <Avatar
            src={trainer.avatar || "/placeholder.svg"}
            alt={trainer.name}
            onClick={() => setViewProfile(!viewProfile)}
          />
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900 mb-1">
              {trainer.name}
            </h1>
          </div>
        </div>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            {traineeUsers && traineeUsers.length > 0 && (
              <div
                className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale cursor-pointer"
                onClick={() => setShowTraineeTable((prev) => !prev)}
              >
                {traineeUsers.map((trainee: User) => (
                  <Avatar
                    key={trainee._id}
                    src={trainee.avatar || "/placeholder.svg"}
                    alt={trainee.name}
                    size="md"
                  />
                ))}
              </div>
            )}
          </div>
          <button
            className="px-4 py-4 bg-primary text-white rounded-full font-bold text-xl hover:bg-primary/80 transition shadow-lg"
            onClick={handleOpenAddTrainee}
            aria-label="Agregar alumno"
            style={{ minWidth: 48, minHeight: 48 }}
          >
            +
          </button>
        </div>
        {showAddTrainee && <AddTraineeModal />}
        {showTraineeTable && traineeUsers && traineeUsers.length > 0 && (
          <TraineeTable />
        )}
        {viewProfile && <TrainerProfile />}
      </div>
    </div>
  );
};

export default TrainerPreviewPage;
