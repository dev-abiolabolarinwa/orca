import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 300px;
  width: 100%;
  background-color: ${(p) => p.theme.colors.grey[5]};
  border-radius: ${(p) => p.theme.radius.md};
  margin-bottom: ${(p) => p.theme.spacing.xs};
`;

export const Input = styled.input`
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  cursor: pointer;
`;

export const Title = styled.h3`
  margin: 0px;
  font-size: ${(p) => p.theme.font.size.lg};
  color: ${(p) => p.theme.colors.general.text};
`;

export const Parraf = styled.p`
  margin: 0px;
  font-size: ${(p) => p.theme.font.size.tiny};
  color: ${(p) => p.theme.colors.general.textSecondary};
`;

export const RoundedButton = styled.div`
  display: flex;
  padding: 12px 12px;
  background-color: ${(p) => p.theme.colors.grey[20]};
  border-radius: 50%;
`;
