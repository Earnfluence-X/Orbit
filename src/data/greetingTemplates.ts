export const greetingTemplates = {
  morning: [
    'Good morning, {name}. Ready to explore?',
    'Rise and shine, {name}. What shall we discover today?',
    'Morning, {name}. The world awaits your questions.',
  ],
  afternoon: [
    'Good afternoon, {name}. What can I help you with?',
    'Hello, {name}. Ready for some insights?',
    'Afternoon, {name}. Let us dive into something interesting.',
  ],
  evening: [
    'Good evening, {name}. Winding down or powering through?',
    'Hello, {name}. Evening is the best time for deep thinking.',
    'Evening, {name}. What is on your mind tonight?',
  ],
  returning: [
    'Welcome back, {name}. Picking up where we left off?',
    'Good to see you again, {name}. What is next?',
    '{name}! I have been waiting. Ready to continue?',
  ],
};

export function getGreeting(name: string, timeOfDay: string, isReturning: boolean): string {
  const templates = isReturning
    ? greetingTemplates.returning
    : greetingTemplates[timeOfDay as keyof typeof greetingTemplates] || greetingTemplates.afternoon;

  const template = templates[Math.floor(Math.random() * templates.length)];
  return template.replace('{name}', name);
}
