export const QUESTION_SEARCH_CRITERIA_QUESTION_TYPES = {
    value:0,
    label:'Question types'
}

export const QUESTION_SEARCH_CRITERIA_MEDIAN_TIME = {
    value:1,
    label:'Median time'
}

export const QUESTION_SEARCH_CRITERIA_PLAY_STATS = {
    value:2,
    label:'Play statistics'
}

export const QUESTION_SEARCH_CRITERIAS = [QUESTION_SEARCH_CRITERIA_QUESTION_TYPES, QUESTION_SEARCH_CRITERIA_MEDIAN_TIME, QUESTION_SEARCH_CRITERIA_PLAY_STATS]

export const CLICKABLE_QUESTION_PARAMETER  = +1
export const KEYBOARD_QUESTION_PARAMETER  = +2
export const MULTIPLE_CHOICE_QUESTION_PARAMETER  = +3

export const QUESTION_TYPES_SEARCH_NAMES = [
    {
        value:CLICKABLE_QUESTION_PARAMETER,
        label:'Clickable question'
    },
    {
        value:KEYBOARD_QUESTION_PARAMETER,
        label:'Keyboard question'
    },
    {
        value:MULTIPLE_CHOICE_QUESTION_PARAMETER,
        label:'Multiple choice question'
    }
]