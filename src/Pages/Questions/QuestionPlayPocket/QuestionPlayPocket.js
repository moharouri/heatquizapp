import { Drawer } from "antd";
import React from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import { CLICKABLE_QUESTION_PARAMETER, KEYBOARD_QUESTION_PARAMETER, MULTIPLE_CHOICE_QUESTION_PARAMETER } from "../List/constants";
import { ClickableQuestionPlay } from "../ClickableQuestion/Play";
import { MultipleChoiceQuestion } from "../MultipleChoiceQuestion/Play";
import { KeyboardQuestionPlay } from "../KeyboardQuestion/Play";

export function QuestionPlayPocket({open, onClose, Id, Type, deadLoad}){

    if(!open) return <div/>;

    const selectedPlayQuestion = (Id, Type) => {
        const selectionList = {
            [CLICKABLE_QUESTION_PARAMETER]: () => <ClickableQuestionPlay Id={Id} showSolution = {true} deadLoad={deadLoad} />,
            [KEYBOARD_QUESTION_PARAMETER]: () => <KeyboardQuestionPlay Id={Id} showSolution = {true} deadLoad={deadLoad}/>,
            [MULTIPLE_CHOICE_QUESTION_PARAMETER]: () => <MultipleChoiceQuestion Id={Id} showSolution={true} deadLoad={deadLoad}/>,
        }
        
        return selectionList[Type]()
    }

    const selectMagnificationValue = (Type) => {
        const selectionList = {
            [CLICKABLE_QUESTION_PARAMETER]: '100%',
            [KEYBOARD_QUESTION_PARAMETER]: '70%',
            [MULTIPLE_CHOICE_QUESTION_PARAMETER]: '70%',
        }
        
        return selectionList[Type]
    }

    const maginificationValue = selectMagnificationValue(Type)

    return(
        <Drawer
        title="Play question"
        width={maginificationValue}
        onClose={onClose}
        open={open}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}
        >
            {selectedPlayQuestion(Id, Type)}
        </Drawer>
    )
}