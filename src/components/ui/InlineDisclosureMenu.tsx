import type { ReactNode } from "react";
import {
  Button,
  Menu,
  MenuItem,
  MenuTrigger,
  Popover,
} from "react-aria-components";
import { DotsVertical } from "@untitledui/icons";

export type DisclosureItem = { id: string; label: string; icon?: ReactNode };
/** Adapted from the supplied disclosure design, with accessible existing primitives. */
export function InlineDisclosureMenu({
  items,
  onAction,
}: {
  items: DisclosureItem[];
  onAction: (id: string) => void;
}) {
  return (
    <MenuTrigger>
      <Button
        className="conversation-menu-trigger"
        aria-label="Conversation actions"
      >
        <DotsVertical width={20} height={20} aria-hidden="true" />
      </Button>
      <Popover
        className="conversation-menu-popover inline-disclosure-popover"
        placement="bottom end"
      >
        <div className="disclosure-menu-heading">Conversation</div>
        <Menu
          aria-label="Conversation actions"
          onAction={(key) => onAction(String(key))}
        >
          {items.map((item) => (
            <MenuItem
              key={item.id}
              id={item.id}
              textValue={item.label}
              className="disclosure-menu-item"
            >
              {item.icon && (
                <span className="disclosure-menu-icon" aria-hidden="true">
                  {item.icon}
                </span>
              )}
              <span>{item.label}</span>
            </MenuItem>
          ))}
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}
