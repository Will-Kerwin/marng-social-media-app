import { useState } from "react";


// own hook which takes in a call back and initial state desigined to be for forms 
export const useForm = (callback, initialState = {}) => {
  // copies initialState prop to an object in hooks state
  const [values, setValues] = useState(initialState);

  // if there is a change it reflects it in state
  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value.trim() });
  };

  // submits to required callback() function (saves writing e.preventDefault() 100 times)
  const onSubmit = e => {
      e.preventDefault();
      callback();
  };

  return {
      onChange,
      onSubmit,
      values
  }
};
