import { Button } from '@mui/material';
import { useChatMessanger } from 'contexts/MessangerContext';
import * as React from 'react';
import i18n from 'services/localization';
import styled from 'styled-components';
import { colors } from 'utils/colors';
import { CHAT_ACTIONS } from 'utils/types';

export const Wrapper = styled.div<{ isRefineOnly?: boolean }>`
  background: ${({ theme: { message } }) => message.backgroundColor};
  border-radius: 10px;
  padding: 24px 28px;
  margin: 0 auto;
  display: flex;
  flex-flow: column;
  max-width: 306px;
  box-sizing: border-box;
  margin-bottom: 24px;
  min-height: 245px;
`;
export const Title = styled.p`
  margin: 0 0 46px;
  white-space: pre-line;
  font-size: 14px;
  line-height: 17px;
  color: ${({ theme: { text } }) => text.color};
  text-align: center;
`;
export const SetJobAlert = styled(Button)`
  margin: 0 0 16px !important;
  color: ${(props) => props.theme.primaryColor}!important;
  border: 1px solid ${(props) => props.theme.primaryColor}!important;
  border-radius: 100px !important;
  text-transform: initial !important;
`;
export const RefineJobSearch = styled(Button)`
  background-color: ${(props) => props.theme.primaryColor}!important;
  border-radius: 100px !important;
  color: ${({ theme: { button } }) => button.secondaryColor}!important;!important;
  text-transform: initial !important;
`;

export const NotFoundOffer = ({ isRefineOnly = false }) => {
  const { triggerAction } = useChatMessanger();
  const title = i18n.t('messages:notFoundJob');
  const jobAlertTxt = i18n.t('buttons:set_job_alert');
  const refineSearchTxt = i18n.t('buttons:refine_search');

  return (
    <Wrapper>
      <Title>{title}</Title>
      <SetJobAlert onClick={() => triggerAction({ type: CHAT_ACTIONS.SET_JOB_ALERT })}>
        {jobAlertTxt}
      </SetJobAlert>
      <RefineJobSearch onClick={() => triggerAction({ type: CHAT_ACTIONS.REFINE_SEARCH })}>
        {refineSearchTxt}
      </RefineJobSearch>
    </Wrapper>
  );
};
