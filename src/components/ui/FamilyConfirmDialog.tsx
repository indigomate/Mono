import type { ReactNode } from "react";
import {
  Button,
  Dialog,
  Heading,
  Modal,
  ModalOverlay,
} from "react-aria-components";
import { XClose, Plus } from "@untitledui/icons";

/** Adaptation of the supplied action-to-confirmation pattern; no financial behaviour. */
export function FamilyConfirmDialog({
  isOpen,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  icon,
  onConfirm,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  icon?: ReactNode;
  onConfirm: () => void;
}) {
  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable
      className="mono-modal-overlay family-confirm-overlay"
    >
      <Modal className="mono-modal family-confirm-modal">
        <Dialog aria-label={title}>
          <Button
            className="family-confirm-close"
            aria-label="Close confirmation"
            onPress={() => onOpenChange(false)}
          >
            <XClose width={20} height={20} aria-hidden="true" />
          </Button>
          <div className="family-confirm-heading">
            <span aria-hidden="true">
              {icon || <Plus width={22} height={22} />}
            </span>
            <Heading slot="title">{title}</Heading>
          </div>
          <p>{description}</p>
          <div className="family-confirm-actions">
            <Button autoFocus onPress={() => onOpenChange(false)}>
              {cancelLabel}
            </Button>
            <Button
              className="family-confirm-primary"
              onPress={() => {
                onConfirm();
                onOpenChange(false);
              }}
            >
              {confirmLabel}
            </Button>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
