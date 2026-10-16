import type { CompactTabsProps } from "../../tabs.types";
import { CompactScrollTabs } from "./compact-scroll-tabs";
import { CompactSegmentedTabs } from "./compact-segmented-tabs";
import { CompactStackTabs } from "./compact-stack-tabs";

export function CompactTabs({
  tabs,
  layout,
  selected,
  defaultSelected,
  onChange,
  onNavigate,
  scrollArrows,
  showTabIcon,
}: CompactTabsProps) {
  if (layout === "segmented") {
    return (
      <CompactSegmentedTabs
        showTabIcon={showTabIcon}
        tabs={tabs}
        layout={layout}
        selected={selected}
        defaultSelected={defaultSelected}
        onChange={onChange}
        // Only the segmented layout renders its tabs as anchors, so it is the
        // only one that can hand a click to the browser.
        onNavigate={onNavigate}
      />
    );
  }

  if (layout === "scroll") {
    return (
      <CompactScrollTabs
        showTabIcon={showTabIcon}
        tabs={tabs}
        layout={layout}
        selected={selected}
        defaultSelected={defaultSelected}
        onChange={onChange}
        scrollArrows={scrollArrows}
      />
    );
  }

  return (
    <CompactStackTabs
      tabs={tabs}
      layout={layout}
      selected={selected}
      defaultSelected={defaultSelected}
      onChange={onChange}
    />
  );
}
