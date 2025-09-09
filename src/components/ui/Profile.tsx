import { useCurrentUser } from "@/hook/useCurrentUser";
import Avatar from "@/components/ui/avatar";
import Modal from "@/components/ui/modal";

export default function Profile({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { data: user } = useCurrentUser();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Perfil del usuario">
      <div className="flex flex-col items-center p-6">
        <Avatar src={user?.avatar} alt={user?.name} size="lg" />
        <h2 className="mt-4 text-xl font-bold">{user?.name}</h2>
        <p className="text-gray-600">{user?.email}</p>
        <p className="text-gray-600">Tel: {user?.phone}</p>
        <p className="text-gray-600">Estado: {user?.status}</p>
      </div>
    </Modal>
  );
}
