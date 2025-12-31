import React, { useState } from "react";
import { Modal, Button } from "flowbite-react";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../server/api";

interface DeleteProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectId: string | undefined;
  projectName: string;
}

export const DeleteProjectModal = ({
  isOpen,
  onClose,
  onSuccess,
  projectId,
  projectName,
}: DeleteProjectModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!projectId) return;

    setIsDeleting(true);
    try {
      await api.delete(`/project/${projectId}`);

      toast.success("Projeto excluído permanentemente.", {
        style: { background: "#EF4444", color: "#fff" },
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir projeto.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal show={isOpen} size="md" onClose={onClose} popup>
      <div className="p-6 text-center">
        <Trash2 className="mx-auto mb-4 h-14 w-14 text-red-500 bg-red-50 rounded-full p-2" />

        <h3 className="mb-2 text-lg font-bold text-gray-800">
          Tem certeza absoluta?
        </h3>
        <p className="mb-5 text-sm text-gray-500">
          Você está prestes a excluir o projeto <b>{projectName}</b>. <br />
          Essa ação não pode ser desfeita.
        </p>

        <div className="flex justify-center gap-4">
          <Button color="failure" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Excluindo..." : "Sim, excluir projeto"}
          </Button>

          <Button color="gray" onClick={onClose} disabled={isDeleting}>
            Não, manter
          </Button>
        </div>
      </div>
    </Modal>
  );
};
