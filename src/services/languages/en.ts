export const en = {
  buttons: {
    send: "Send",
    sent: "Sent",
    submit: "Submit",
    cancel: "Cancel",
    browse: "Browse",
    set_job_alert: "Set Job Alert",
    refine_search: "Refine Job Search",
    find_job: "Find a job",
    ask_questions: "Ask questions",
    searchJobs: "Search jobs with resume",
    make_referral: "Make a referral",
  },
  placeHolders: {
    default: "Type a message",
    message: "Select or Type a Job Title",
    bot_typing: "Bot is typing...",
    chooseLocation: "Select or Type a Job Location",
    email: "Email",
    alert_category: "Reply to choose category...",
    startTyping: "Start typing to select a job title...",
    selectOption: "Please select one of the options",
  },
  labels: {
    required: "Required",
    email_invalid: "Email is invalid",
    max_length: "File may be no larger than 2MB",
    email_or_phone_invalid: "Email or phone is invalid",
  },
  languages: {
    en: "English",
    fr: "French",
    ua: "Ukrainian",
  },
  messages: {
    initialMessage: "Hi! Are you looking for a job?",
    uploadCV: "Upload resume",
    dragAndDrop: "Drag and drop a resume file here",
    answerQuestions: "Answer questions",
    whatJobTitle:
      "What's your preferred job title? We'll try finding similar jobs.",
    botMessageYou:
      "Where do you want to work? This can be your current location or a list of preferred locations.",
    whatCategoryJob: "What's your preferred job category title?",
    setJobAlert: "Set Job Alert",
    interestedCategories:
      "Which of our job categories are you interested in? \n \n ⁠You can select a single category or multiple.",
    alertPeriod: "How often would you like to receive your job alerts?",
    monthy: "Monthly",
    weekly: "Weekly",
    daily: "Daily",
    alertEmail:
      "What's the best email address to reach you? \n \n We will only contact you for updates and potential job opportunities",
    emailAlreadyProvided:
      "You've successfully subscribed to job alerts using the email address that you've already provided",
    successSubscribed: "You've successfully subscribed to job alerts.",
    thanks: "Thanks!",
    contactLater: "We will only contact you for potential job opportunities.",
    niceToMeet: "Nice to meet you, {{name}}",
    reachEmail:
      "What's the best email address or phone number to reach you? \n \n We will only contact you for potential job opportunities.",
    whatFullName: "What's your full name?",
    fewQuestions:
      "We have a few questions about your background and experience to get your application started.",
    jobRecommendations:
      "Thanks Here are your job recommendations based on the information you provided.",
    notFoundJob: "Didn’t find the right job? \n \n Here’s what you can do",
    applyThanks: "Thanks for applying for this position",
    provideName: "Please provide your name",
    provideEmail: "Please provide your email",
    provideAge: "Please provide your age",
    permitWork: "Are you allowed to work in US?",
    yes: "Yes",
    no: "No",
    desireSalary: "Great, what sort of salary are you looking for?",
    ethnic: "What’s your ethnic background?",
    wishNotSay: "Do not wish to say",
    ethnicWhite: "White",
    ethnicHispanic: "Hispanic",
    noPermitWork:
      "Sorry, you can not apply for this position, since your don’t have work permit",
    changeLang: "You changed the \n  language to {{lang}}",
    howMuchExperience: "How much work experience do I need for your company?",
    howSubmitCV: "Can I submit my CV",
    whatHiring: "What is the hiring process?",
    popularQuestions:
      "OK! Here are a few popular questions to help you get started.",
    emailAnswer: "Thanks! We will send you an answer on email",
    noMatchMessage:
      "Sorry, we couldn't find a match for personal job recommendations. Below are the actions that you can take.",
    wantContinue: "Do you want to continue?",
    submitFile:
      "Your resume has been attached.\n You can click the X to remove it and re-upload another one or click below to upload and search for jobs",
    botThanks:
      "Thank you for expressing your interest in this job, please check your email for updates.",
    employeeId: "What is your Employee ID ?",
  },
  chat_item_description: {
    lookingFor: "Hi! Are you looking for a job",
    title: "Career bot",
    view_job_title: "View job",
    no_match: "Sorry, No match yet",
    enter_email_title: "Please enter your email and we will send you an email",
    transcript_sent: "Your transcript has been sent to your email",
    categories_title: "Select or Type a Job Title",
    locations_title: "Searched location",
    all_categories: "All Categories",
    hiring_help_title: "Check out our help section to learn more .",
    hiring_help_text: "Help",
    hiring_helpful_text: "Has this reply has been helpful?",
    interested_in: "I’m interested",
    read_more: "Read more",
    success_interested:
      "Thank you for expressing your interest in this job. We have used the personal details that you provided earlier.",
    short_success_interested:
      "Thank you for expressing your interest in this job.",
  },
  chat_menu: {
    save_transcript: "Save transcript",
    change_lang: "Change language",
    ask_question: "Ask questions",
    find_job: "Find a job",
  },
  questions: {
    about_company: "Can you tell me more about the company?",
    flexible_work: "Does GMS offer flexible work schedules?",
    part_time: "Do you offer part-time positions?",
    recruitment_process: "What’s the recruitment process?",
  },
};

export type Localization = typeof en;
