import styled from 'styled-components';

export const SelectContainer = styled.div`
  display: flex;
  vertical-align: center;
  margin-top: ${(p) => p.theme.spacing.sm};
  padding: 0 ${(p) => p.theme.spacing.xs};
`;

export const MediaZone = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: fit-content;
  max-height: 420px;
  border: 1px solid ${(p) => p.theme.colors.grey[40]};
  border-radius: ${(p) => p.theme.radius.md};
  margin-bottom: ${(p) => p.theme.spacing.sm};
  padding: ${(p) => p.theme.spacing.xs} ${(p) => p.theme.spacing.xs} ${(p) => p.theme.spacing.xxs}
    ${(p) => p.theme.spacing.xs};
`;

export const Options = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${(p) => p.theme.colors.grey[10]};
  padding: ${(p) => p.theme.spacing.xs} ${(p) => p.theme.spacing.xs} ${(p) => p.theme.spacing.xxs}
    ${(p) => p.theme.spacing.xs};
  border-radius: ${(p) => p.theme.radius.md};
`;

export const OptionsText = styled.span`
  font-size: ${(p) => p.theme.font.size.xs};
  border-radius: ${(p) => p.theme.radius.md};
`;

export const Group = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const RoundedButton = styled.div`
  display: flex;
  padding: 8px 12px;
  background-color: ${(p) => p.theme.colors.grey[30]};
  border-radius: 50%;
`;
