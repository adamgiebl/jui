import baseStyled, { ThemedStyledInterface } from "styled-components";
import darculaTheme from "../themes/darcula.theme.json";

// TODO: better typing?
export type Theme = typeof darculaTheme;

export const styled = baseStyled as ThemedStyledInterface<Theme>;
