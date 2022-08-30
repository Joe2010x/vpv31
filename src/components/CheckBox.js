import React, {useState} from 'react'

const CheckBox = (props) =>{
    const [isChecked,setIsChecked] = useState(props.initialChecked)
    console.log("initial check for "+props.label+" is "+props.initialChecked)

    const onChange =(event)=>{
        setIsChecked(event.currentTarget.checked)
        props.onChange (isChecked)
        event.preventDefault()
    }

    return (
        <div className='checkbox'>
            <label >
                {props.label}
            </label>
            <input
                type="checkbox"
                checked={isChecked}
                onChange={onChange}
                >
            </input>
        </div>
    )
}

export default CheckBox
