import React from 'react';
import {Input, Button} from 'semantic-ui-react';
import './styles.css'
const InputField = (props) => <Input value={props.value} style={props.inputstyle} size={props.size} placeholder={props.placeholder} label={props.label}  onChange={(e) => props.setInput('symbol',e.target.value)}
 onKeyPress={event => {
                if (event.key === 'Enter') {
                  props.addSymbol()
                }
              }}

/>

const SubmitField = (props) => <Button size={props.size} onClick={() => props.functionToExecute() }> {props.text} </Button>



export { InputField, SubmitField }
