/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
// import { DevTool } from "@hookform/devtools";

let renderCount = 0;
export const YouTubeForm = () => {
  // useForm() return servral properties and functions to work with form
  const form = useForm({
    // The defaultValues prop populates the entire form with default values.
    // It supports both synchronous and asynchronous assignment of default values.
    // Synchronous way
    defaultValues: {
      username: "Monkey D. Luffy",
      email: "emporer@onepiece.com",
      channel: "Strawhat",
      social: {
        twitter: "",
        linkedin: "saihllamture",
      },
      phonenumbers: ["", ""],
      phNumbers: [{ number: "" }],
      age: 0,
      dob: new Date(),
    },
    /* Validation mode:
    "onBlur" mode will trigger validation on the element when the element is clicked outside of the validation area.
    "onChange" mode will trigger the validation function every time the input field changes. It triggers multiple rerenders.
    "onSubmit" mode will trigger the validation function only once when the form is submitted.
    "onTouched" mode will trigger the validation function every time the input field changes value or changes the value of the validation field.
    "all" mode is combination of onBlur and onChange event.
    
    Note: Be mindful of potential re-rendering while choosing the validation mode.
    */
    mode: "onSubmit",
    // Asynchronous way: what if we want to get already saved data from backend api
    // defaultValues : async () => {
    //   const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
    //   const data = await response.json();
    //   return {
    //     username: data.username,
    //     email: data.email,
    //     channel: data.company.name,
    //   }
    // }
  });
  const {
    register,
    control,
    handleSubmit,
    formState,
    getValues,
    setValue,
    watch,
    reset,
    trigger, //manually trigger validation for our form fields
  } = form;
  //Touched & dirty fields: dirtyFields, toucedFields, isDirty is useful while submitting form
  const {
    errors,
    dirtyFields,
    touchedFields,
    isDirty,
    isValid,
    isSubmitting,
    isSubmitted,
    isSubmitSuccessful,
    submitCount,
  } = formState;
  // console.log({dirtyFields, touchedFields, isDirty, isValid});
  // isSubmitting & isSubmitted have "false" as default values and become true if the form is submitted successfully
  // submitCount will be incremented every time the form is submitted successfully.
  // isSubmiySuccessful is true if the form is submitted successfully and false if error is encountered
  // console.log({isSubmitting, isSubmitted, isSubmitSuccessful, submitCount});
  const { fields, append, remove } = useFieldArray({
    name: "phNumbers",
    control,
  });

  // But destructuring here and again uusing it in the input field is repetative and makes code lengthy
  // So we can directly use register inside the input field using spread operator
  // const { name, ref, onChange, onBlur} = register("userename");

  // function to submit the form
  const onSubmit = (data) => {
    console.log("Form Submitted", data);
    // form.reset(); // to reset the form after submission
  };

  const onError = (errors) => {
    console.log("Form Validation Error", errors);
  };

  const handleGetValues = () => {
    console.log("Get Values", getValues(["username", "channel"]));
  };

  const handleSetValue = () => {
    setValue("username", "", {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  //Recommended not to use "reset" method inside "onSubmit" function
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  renderCount++;

  return (
    <div>
      <h1>RHF YouTube Form ({renderCount / 2})</h1>
      {/* 
  Q. Why to use "handleSubmit()" from "form" instead of directly passing "OnSubmit()" function to "onSubmit" event handler?
      - handleSubmit() contains the "OnSubmit" & "OnError" methods which will be called when the form is submitted and
      the validation error is encountered.
      - handleSubmit() will automatically handle form submission and validation,
      so we don't have to write the same code in onSubmit function.
      - handleSubmit() will return a Promise and we can use it in async/await or .then() methods.
      - handleSubmit() will also automatically reset the form after successful submission.
    */}
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <div className="form-control">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            {...register("username", { required: "Username is required" })}
          />
          <p className="error">{errors.username?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="email">Email ID</label>
          <input
            type="email"
            id="email"
            {...register("email", {
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email format",
              },
              validate: {
                notAdmin: (value) => {
                  return (
                    value !== "admin@example.com" ||
                    "Enter different email address"
                  );
                },
                notBlackListed: (value) => {
                  return (
                    !value.endsWith("baddomain.com") ||
                    "This domain is blacklisted"
                  );
                },
                //Async way of validation for email addresses already exists or not
                emailAvailable: async (value) => {
                  const response = await fetch(
                    `https://jsonplaceholder.typicode.com/users?email=${value}`
                  );
                  const data = await response.json();
                  return data.length == 0 || "Email already exists";
                },
              },
            })}
          />
          <p className="error">{errors.email?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="channel">Channel Name</label>
          <input
            type="text"
            id="channel"
            {...register("channel", { required: "channel name is required" })}
          />
          <p className="error">{errors.channel?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="twitter">Twitter</label>
          <input
            type="text"
            id="twitter"
            {...register("social.twitter", {
              //"disabled" property disable the both writing & validation
              //Here I'm checking if channel field is empty then disable this field also
              disabled: watch("channel") === "",
              required: true, //, //
            })}
          />
        </div>

        <div className="form-control">
          <label htmlFor="linkedin">LinkedIn</label>
          <input type="text" id="linkedin" {...register("social.linkedin")} />
        </div>

        <div className="form-control">
          <label htmlFor="primary-no">Primary Phone Number</label>
          <input
            type="text"
            id="primary-no"
            {...register("phonenumbers[0]", {
              validate: {
                maxLength: (value) => {
                  return (
                    value.length <= 10 ||
                    "Phone number should be 10 digits long"
                  );
                },
                minLength: (value) => {
                  return (
                    value.length === 10 ||
                    "Phone number should be exactly 10 digits long"
                  );
                },
              },
            })}
          />
          <p className="error">{errors.phonenumbers?.[0]?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="secondary-no">Secondary Phone Number</label>
          <input
            type="text"
            id="secondary-no"
            {...register("phonenumbers[1]", {
              validate: {
                maxLength: (value) => {
                  return (
                    value.length <= 10 ||
                    "Phone number should be 10 digits long"
                  );
                },
                minLength: (value) => {
                  return (
                    value.length === 10 ||
                    "Phone number should be exactly 10 digits long"
                  );
                },
              },
            })}
          />
          <p className="error">{errors.phonenumbers?.[1]?.message}</p>
        </div>

        <div>
          <label>List of phone numbers</label>
          <div>
            {fields.map((field, index) => {
              return (
                <div className="form-control" key={field.id}>
                  <input
                    type="text"
                    {...register(`phNumbers.${index}.number`)}
                    defaultValue={field.number}
                  />

                  {index > 0 && (
                    <button type="button" onClick={() => remove(index)}>
                      Remove
                    </button>
                  )}
                </div>
              );
            })}
            <button
              type="button"
              onClick={() =>
                append({
                  number: "",
                })
              }
            >
              Add phone number
            </button>
          </div>
        </div>

        <div className="form-control">
          <label htmlFor="channel">Age</label>
          <input
            type="number"
            id="age"
            {...register("age", {
              valueAsNumber: true,
              required: {
                value: true,
                message: "Age is required",
              },
            })}
          />
          <p className="error">{errors.age?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="dob">Date of Birth</label>
          <input
            type="date"
            id="dob"
            {...register("dob", {
              valueAsDate: true,
              required: {
                value: true,
                message: "Date of birth is required",
              },
            })}
          />
          <p className="error">{errors.dob?.message}</p>
        </div>

        {/* Here "isSubmitting" property disables the submit btn while form getting submitted.
        It prevents user from multiple submission. */}
        <button disabled={!isDirty || isSubmitting}>Submit</button>
        <button type="button" onClick={() => reset()}>
          Reset
        </button>
        <button type="button" onClick={handleGetValues}>
          Get Values
        </button>
        <button type="button" onClick={handleSetValue}>
          Set Value
        </button>
        {/* You can add field name inside the trigger to validate specific field, like trigger("channel") */}
        <button type="button" onClick={() => trigger()}>
          Validate
        </button>
      </form>
      {/* <DevTool control={control} /> //for debugging purpose */}
    </div>
  );
};
