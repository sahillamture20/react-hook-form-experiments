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
        twitter: "sahiltwits",
        linkedin: "saihllamture",
      },
      phonenumbers: ["", ""],
      phNumbers: [{ number: "" }],
      age: 0,
      dob: new Date()
    },
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
  const { register, control, handleSubmit, formState, getValues, setValue } = form;
  const { errors } = formState;

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

  const handleGetValues = () => {
    console.log("Get Values", getValues(["username", "channel"]));
  }
 
  const handleSetValue = () => {
    setValue("username", "", {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });
  }
  renderCount++;
  return (
    <div>
      <h1>RHF YouTube Form ({renderCount / 2})</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
          <input type="text" id="twitter" {...register("social.twitter")} />
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
                  return value.length <= 10 || "Phone number should be 10 digits long";
                },
                minLength: (value) => {
                  return value.length === 10 || "Phone number should be exactly 10 digits long";
                }
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
                  return value.length <= 10 || "Phone number should be 10 digits long";
                },
                minLength: (value) => {
                  return value.length === 10 || "Phone number should be exactly 10 digits long";
                }
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
                message: "Age is required" }
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
                message: "Date of birth is required" }
            })}
          />
          <p className="error">{errors.dob?.message}</p>
        </div>

        <button>Submit</button>
        <button type="button" onClick={handleGetValues}>Get Values</button>
        <button type="button" onClick={handleSetValue}>Set Value</button>
      </form>
      {/* <DevTool control={control} /> //for debugging purpose */}
    </div>
  );
};
