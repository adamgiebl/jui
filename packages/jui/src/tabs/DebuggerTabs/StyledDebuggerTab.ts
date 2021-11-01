import { Theme } from "jui/Theme";
import { styled } from "jui/styled";

import { StyledDefaultTab } from "jui/tabs";
import { getTabThemeStyles, TabTheme } from "jui/tabs";

export const debuggerTabTheme = ({ theme }: { theme: Theme }): TabTheme => ({
  underlineHeight: theme.value<number>("DebuggerTabs.underlineHeight") ?? 2,
  underlinedTabBackground: theme.color("DebuggerTabs.underlinedTabBackground"),
});
export const StyledDebuggerTab = styled(StyledDefaultTab)`
  ${({ theme }) => getTabThemeStyles(debuggerTabTheme({ theme }))};
`;
