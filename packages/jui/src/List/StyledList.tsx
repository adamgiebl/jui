import { styled } from "../styled";
import { css } from "styled-components";

export const StyledList = styled.ul<{ fillAvailableSpace?: boolean }>`
  padding: 0;
  margin: 0;
  list-style: none;
  max-height: 100%;
  overflow: auto;
  color: ${({ theme }) => theme.color("*.textForeground")};
  outline: none;
  ${({ fillAvailableSpace }) =>
    fillAvailableSpace &&
    css`
      flex: 1;
      height: 100%;
    `}
  background: ${({ theme }) => theme.color("List.background")};
`;
