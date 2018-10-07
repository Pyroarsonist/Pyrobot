const regexes = [
  { regex: /слава/gi, answer: 'україні!' },
  { regex: /героям/gi, answer: 'слава!' },
  { regex: /сбот/gi, answer: 'помойный бот' },
  { regex: /анекдот/gi, answer: 'убейся' },
  { regex: /вода/gi, answer: 'ммм водичка' },
  { regex: /эшер/gi, answer: 'эшер, где твой деанон?' },
  { regex: /кпи/gi, answer: 'КПИ - та еще шарага' },
  { regex: /шемс/gi, answer: 'бог ноды' },
  { regex: /огонь|поджег|горячо/gi, answer: '🔥' },
  { regex: /frog|лягушка|жаба/gi, answer: '🐸' },
  { regex: /аниме/gi, answer: 'на аве - здоровья маме' },
  {
    regex: /ann|аня|ор|админ|анна/gi,
    answer:
      'Анна Ор - хорошая тян и великий (не по фамилии) админ\nпервая леди пловца на районе',
  },
  {
    regex: /ебот|эшербот/gi,
    answer: 'Боже, а это что?',
  },
  {
    regex: /гб|бюджет/gi,
    answer: 'эээ свыш за гобэ голосни',
  },
];

export default regexes;
