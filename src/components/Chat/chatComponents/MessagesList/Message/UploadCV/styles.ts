import styled from "styled-components";
import { COLORS } from "utils/colors";
import { IMAGES } from "assets";

export const Wrapper = styled.div`
  margin-bottom: 16px;
`;

export const UploadImg = styled.div`
  width: 30px;
  height: 30px;
  filter: contrast(0.2);
  background: url(${IMAGES.UPLOAD_FILE}) no-repeat;
  background-size: cover;
`;

export const Button = styled.label`
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
  color: ${({ theme: { message } }) => message.file.color};
  font-size: 14px;
`;

export const FileError = styled(FileName)``;

export const Circle = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin: 0 0 16px;
  background: ${COLORS.WHITE};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
