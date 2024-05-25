export { extractStatsFromResponse, testObject };

const testObject = {
    'stats': ['HP', 'attack'],
    'modifiers': [
        {
            'question': 'Did {{char}} get attacked?',
            'useContext': false,
            'effects': [
                {
                    'stat': 'HP',
                    'answer': 'yes',
                    'value': -10,
                },
                {
                    'stat': 'HP',
                    'answer': 'no',
                    'value': 10,
                },
            ],
        },
    ],
    'injections': [
        {
            'stat': 'HP',
            'type': '<=',
            'value': 0,
            'injection': '{{char}} has been mortally wounded and will die soon',
        },
    ],
};


function extractStatsFromResponse(statSettings, text) {
    const result = {};

    // Extract stats and their possible answers
    const statAnswers = {};
    statSettings.modifiers.forEach(modifier => {
        modifier.effects.forEach(effect => {
            if (!statAnswers[effect.stat]) {
                statAnswers[effect.stat] = [];
            }
            if (!statAnswers[effect.stat].includes(effect.answer.toLowerCase())) {
                statAnswers[effect.stat].push(effect.answer.toLowerCase());
            }
        });
    });

    // Match the text with possible answers for each stat
    for (const stat in statAnswers) {
        const answers = statAnswers[stat].join('|');
        const regex = new RegExp(`${stat}.*?(${answers})`, 'i');
        const match = text.match(regex);
        if (match) {
            result[stat] = match[1].toLowerCase();
        }
    }

    return result;
}
