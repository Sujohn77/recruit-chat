import styled from 'styled-components';
import { colors } from 'utils/colors';
import { IMAGES } from 'utils/constants';

export const Wrapper = styled.div`
  background: ${({ theme: { message } }) => message.backgroundColor};
  border-radius: 10px;
  padding: 32px 17px 16px;
  margin: 0 auto;
  display: flex;
  flex-flow: column;
  width: 220px;
  align-items: center;
  color: ${({ theme: { message } }) => message.chat.color}
  margin-bottom: 24px;
  position: relative;
`;

export const Avatar = styled.div`
  width: 30px;
  height: 30px;
  filter: contrast(0.2);
  background: url(${IMAGES.UPLOAD_FILE}) no-repeat;
  background-size: cover;
`;

export const Browse = styled.label`
  margin: 11px 0 16px;
  color: ${({ theme: { button } }) => button.secondaryColor};
  background: ${(props) => props.theme.primaryColor};
  padding: 11px 0;
  text-align: center;
  width: 100%;
  cursor: pointer;
  font-size: 14px;
  line-height: 17px;
  border-radius: 100px;
  font-weight: 500;
`;

export const Cancel = styled.div`
  font-size: 14px;
  line-height: 17px;
  border-bottom: 1px solid ${(props) => props.theme.primaryColor};
  color: ${(props) => props.theme.primaryColor};
  cursor: pointer;
`;

export const Text = styled.p`
  margin: 0 0 16px;
`;
export const FileWrapper = styled.div`
  display: flex;
  gap: 5px;
`;

export const FileName = styled.p`
  margin: 0;
  color: ${({ theme: { message } }) => message.file.color}
  font-size: 14px;
`;

export const FileError = styled(FileName)``;

export const Circle = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin: 0 0 16px;
  background: ${colors.white};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
