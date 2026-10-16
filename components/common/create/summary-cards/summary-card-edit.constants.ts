/** Summary card character edit — shared copy and shell tokens. */
export const SUMMARY_CARD_EDIT = {
  title: "Edit character details",
  titleIconSrc: "/assets/edit-icon.svg",
  nameLabel: "Name",
  bioLabel: "Biography",
  bioPlaceholder: "Add a biography…",
  saveLabel: "Save changes",
  closeLabel: "Close character editor",
} as const;

/** Mobile drawer hugs the biography. A long bio may grow until the sheet nears the top of the screen. */
export const SUMMARY_CARD_EDIT_MODAL_SHELL_CLASSNAME =
  "max-md:!mb-2 max-md:!h-fit max-md:!max-h-[95dvh]";

/**
 * Biography editor stops growing and scrolls. On the desktop card the cap is
 * 12.5rem so the field stays inside the frame. On the mobile sheet it grows
 * with the text, then scrolls before Save changes leaves the screen. 18rem is
 * reserved for the title, name field, biography label, and save button.
 */
export const SUMMARY_CARD_EDIT_BIO_CLASSNAME =
  "max-h-50 w-full overflow-y-auto overscroll-contain [&_textarea]:max-h-50 [&_textarea]:overflow-y-auto [&_textarea]:overscroll-contain max-md:max-h-[calc(95dvh-12rem)]! max-md:[&_textarea]:field-sizing-content! max-md:[&_textarea]:max-h-[calc(95dvh-18rem)]!";
