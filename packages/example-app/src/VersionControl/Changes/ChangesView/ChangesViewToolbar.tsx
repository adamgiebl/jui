import {
  Toolbar,
  ToolbarSeparator,
  ActionTooltip,
  CommonActionId,
  TooltipTrigger,
  ActionButton,
} from "@intellij-platform/core";
import { ChangeListsActionButton } from "./ActionButtons/ChangeListsActionButton";
import { GroupByActionButton } from "./ActionButtons/GroupByActionButton";
import { ViewOptionsActionButton } from "./ActionButtons/ViewOptionsActionButton";
import React from "react";

import { VcsActionIds } from "../../VcsActionIds";

export function ChangesViewToolbar() {
  return (
    <Toolbar hasBorder>
      <ActionButton actionId={VcsActionIds.REFRESH} />
      <ActionButton actionId={VcsActionIds.ROLLBACK} />
      <ActionButton actionId={VcsActionIds.SHOW_DIFF} />
      <TooltipTrigger tooltip={<ActionTooltip actionName="Changelists" />}>
        <ChangeListsActionButton />
      </TooltipTrigger>
      <ActionButton actionId={VcsActionIds.SHELVE_SILENTLY} />
      <ToolbarSeparator />
      <TooltipTrigger tooltip={<ActionTooltip actionName="Group By" />}>
        <GroupByActionButton />
      </TooltipTrigger>
      <TooltipTrigger tooltip={<ActionTooltip actionName="View Options" />}>
        <ViewOptionsActionButton />
      </TooltipTrigger>
      <ActionButton actionId={CommonActionId.EXPAND_ALL} />
      <ActionButton actionId={CommonActionId.COLLAPSE_ALL} />
    </Toolbar>
  );
}
