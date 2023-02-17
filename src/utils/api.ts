import axios, { AxiosResponse } from 'axios';

const client = axios.create({
    baseURL: 'http://localhost:4444',
});

export interface IApiThemeResponse {
    client_primary_colour: string;
    client_secondary_color: string;
    chatbot_border_color: string;
    chatbot_border_thickness: string;
    chatbot_border_style: string;
    chatbot_logo_URL: string;
    chatbot_header_color: string;
    chatbot_bubble_color: string;
    chat_button_secondary_color: string;
    chat_search_results_color: string;
    chatbot_name: string;
    chatbot_header_text_colour: string;
}

export const api = {
    test: (apikey: string): Promise<AxiosResponse<IApiThemeResponse, any>> =>
        client.get('/test-for-bot', {
            headers: {
                'x-api-key': apikey,
            },
        }),
};
