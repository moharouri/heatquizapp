import {Button, Drawer, Dropdown, Row, Space} from "antd";
import React, { useEffect, useState } from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import { CompactQuestionComponent } from "../../Questions/SearchQuestionsList/CompactQuestionComponent";

export function AssignQuestionsToPool({open, onClose, Series}){

    const [selectedPool, setSelectedPool] = useState(1)
    const [selectedQuestions, setSelectedQuestions] = useState([])


    useEffect(() => {
      setSelectedPool(1)
      setSelectedQuestions([])
    }, [open])

    if(!open) return <div/>;

    const {Elements} = Series

    let questions = Elements.filter(a => a.PoolNumber !== selectedPool) .map(e => e.Question) 
    const {Stats} = Series

    if(Stats){
      questions = questions.map((q, qi) => ({
        ...q,
        MedianPlayTime: Stats[Elements[qi].Id].MedianPlayTime,
        TotalGames: Stats[Elements[qi].Id].TotalPlay,
        TotalCorrectGames:Stats[Elements[qi].Id].TotalSuccessPlay
      }))
    }

    const handleSelectQuestion = (q) => {
      const questionIsSelected = selectedQuestions.map(a => a.Id).includes(q.Id)

      let _selectedQuestions = [...selectedQuestions]

      if(questionIsSelected){
          _selectedQuestions = _selectedQuestions.filter(a => a.Id !== q.Id)
      }
      else{
          _selectedQuestions.push(q)
      }

      setSelectedQuestions(_selectedQuestions)
    }

    const getPoolNumbersList = () => {
        const {NumberOfPools} = Series

        let finalList = []

        for(let i = 0; i < NumberOfPools; i++){            
            finalList.push({
                key: 'pool_number'+(1+i),
                label: 'Select Pool #' + (1+i),
                onClick: () => {
                  setSelectedQuestions([])
                  setSelectedPool(i+1)
                }
            })
        }

        return finalList
    }

    const renderPools = () => {
      return(
        <Dropdown
            menu={{
              items: getPoolNumbersList(),
              title:'Change pool number'
            }}
          >
            <div>
            <small className="series-edit-view-element-selected-pool-word">Selected pool: </small>
            <p className="series-edit-view-element-selected-pool-assign">Pool #{selectedPool}</p>
            </div>
          </Dropdown>
      )
    }

    return(
        <Drawer
        title={
          <Space 
            size={'large'}
          >
            <p>Assign questions to pool</p>
            {renderPools()}

            {selectedQuestions.length ? 
            <Button
              size="small"
              type="primary"
              onClick={() => {}}
            >
              Update assignment
            </Button> : <div/>}
          </Space>
        }
        width={'100%'}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}
        >
            <p
              className="series-edit-view-element-selected-pool-word"
            >Questions assigned to 
            <span 
              className="series-edit-view-element-selected-pool-assign"
            >
              Pool #{selectedPool}
            </span> are not shown</p>
            <br/>
            <Row
                    gutter={[12, 12]}
                >
                    {questions.map((q, qi) => 
                        (
                            <CompactQuestionComponent 
                                q={q}
                                qi={qi}
                                firstIndex={0}
                                selectedQuestions = {selectedQuestions}
                                onRenderCode = {(q, i) =>
                                  
                                  <p  
                                    onClick={() => handleSelectQuestion(q)}
                                    className="series-edit-view-element-code">
                                    
                                    {i}{' '}{q.Code}
                                  </p>
                                }
                            />
                        )
                    )}
                </Row>
        </Drawer>
    )
}