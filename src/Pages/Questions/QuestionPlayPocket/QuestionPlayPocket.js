import { Drawer } from "antd";
import React from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import { CLICKABLE_QUESTION_PARAMETER, KEYBOARD_QUESTION_PARAMETER, MULTIPLE_CHOICE_QUESTION_PARAMETER } from "../List/constants";
import { ClickableQuestionPlay } from "../ClickableQuestion/Play";
import { MultipleChoiceQuestion } from "../MultipleChoiceQuestion/Play";
import { KeyboardQuestionPlay } from "../KeyboardQuestion/Play";

export function QuestionPlayPocket({open, onClose, Id, Type}){

    if(!open) return <div/>;

    const selectedPlayQuestion = (Id, Type) => {
        const selectionList = {
            [CLICKABLE_QUESTION_PARAMETER]: () => <ClickableQuestionPlay Id={Id} showSolution = {true}/>,
            [KEYBOARD_QUESTION_PARAMETER]: () => <KeyboardQuestionPlay Id={Id} showSolution = {true}/>,
            [MULTIPLE_CHOICE_QUESTION_PARAMETER]: () => <MultipleChoiceQuestion Id={Id} showSolution={true}/>,
        }
        
        return selectionList[Type]()
    }

    return(
        <Drawer
        title="Play question"
        width={'70%'}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}
        >
            {selectedPlayQuestion(Id, Type)}
        </Drawer>
    )
}