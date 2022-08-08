export const en = {
  buttons: {
    send: 'Send',
    submit: 'Submit',
    cancel: 'Cancel',
    browse: 'Browse',
    set_job_alert: 'Set Job Alert',
    refine_search: 'Refine job search',
    find_job: 'Find a job',
    ask_question: 'Ask a question',
  },
  placeHolders: {
    message: 'Type a message',
    bot_typing: 'Bot is typing...',
    chooseLocation: 'Reply to choose location...',
    email: 'Email',
    alert_category: 'Reply to choose category...',
  },
  labels: {
    required: 'Required',
    email_invalid: 'Email is invalid',
    max_length: 'File may be no larger than 2MB',
  },
  languages: {
    en: 'English',
    fr: 'French',
    ua: 'Ukrainian',
  },
  messages: {
    resume_uploaded: '{{initials}} uploaded resume',
    transcript_sent: 'Transcript sent to {{initials}}',
  },
  chat_item_description: {
    lookingFor: 'Hi! Are you looking for a job',
    title: 'Career bot',
    view_job_title: 'View job',
    no_match: 'Sorry, No match yet',
    enter_email_title: 'Please enter your email and we will send you an email',
    transcript_sent: 'Your transcript has been sent to your email',
    categories_title: 'Searched category title',
    locations_title: 'Searched location',
    all_categories: 'All Categories',
  },
  chat_menu: {
    save_transcript: 'Save transcript',
    change_lang: 'Change language',
    ask_question: 'Ask a question',
    find_job: 'Find a job',
  },
};

export type Localization = typeof en;
