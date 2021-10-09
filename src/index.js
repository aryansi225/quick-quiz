import "./index.scss"
import {TextControl, Flex, FlexBlock, FlexItem, Button, Icon} from "@wordpress/components"

function updateField() {
    let disabled = false
    wp.data.subscribe(function() {
        const results = wp.data.select("core/block-editor").getBlocks().filter(function(block) {
            return block.name == "myplugin/quick-quiz" && block.attributes.correctAnswer == undefined
        })
        if(results.length && disabled == false){
            disabled=true
            wp.data.dispatch("core/editor").lockPostSaving("Quick Quiz Answer Not Selected")
        }
        if(!results.length && disabled){
            disabled=false
            wp.data.dispatch("core/editor").unlockPostSaving("Quick Quiz Answer Not Selected")
        }
    })
}

updateField();

wp.blocks.registerBlockType("myplugin/quick-quiz", {
    title: "Quick Quiz",
    icon: "awards",
    category: "common",
    attributes: {
        question: {type: "string"},
        answers: {type: "array", default: [""]},
        correctAnswer: {type: "number", default: undefined}
    },
    edit: EditComponent,
    save: function(props){
        return null
    }
})

function EditComponent(props) {
    function updateQuestion(value){
        props.setAttributes({question: value})
    }

    function deleteAnswer(indexToDelete){
        const newAnswers = props.attributes.answers.filter(function(x, index) {
            return index != indexToDelete
        })
        props.setAttributes({answers: newAnswers})
        if(indexToDelete == props.attributes.correctAnswer){
            props.setAttributes({correctAnswer: undefined})
        }
    }

    function correctAnswer(correctIndex){
        props.setAttributes({correctAnswer: correctIndex})
    }
    return (
        <div className="quick-quiz-block">
            <TextControl label="Question:" value={props.attributes.question} onChange={updateQuestion} style={{fontSize: "20px"}}/> 
            <p style={{fontSize: "13px", margin: "20px 0 8px 0"}}>Answers:</p>
            {props.attributes.answers.map(function(answer, iter){
                return(
                    <Flex>
                        <FlexBlock>
                            <TextControl autoFocus={answer == undefined} value={answer} onChange={newValue => {
                                const newAnswers = props.attributes.answers.concat([])
                                newAnswers[iter] = newValue
                                props.setAttributes({answers: newAnswers})
                            }}/>
                        </FlexBlock>
                        <FlexItem>
                        <Button onClick={() => correctAnswer(iter)}>
                            <Icon className="correct" icon={props.attributes.correctAnswer == iter ? "star-filled" : "star-empty"} />
                        </Button>
                        </FlexItem>
                        <FlexItem>
                        <Button className="remove" icon="remove" onClick = {() => deleteAnswer(iter)}>
                        </Button>
                    </FlexItem>
                </Flex>
                )
            })}
            <Button isPrimary icon="plus" onClick={() => {
                props.setAttributes({answers: props.attributes.answers.concat([undefined])})
            }}></Button>
        </div>
    )
}