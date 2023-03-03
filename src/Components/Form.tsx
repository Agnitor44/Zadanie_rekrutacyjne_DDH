import React, { useState, useEffect, useRef } from "react";
import { 
  fetchDepartment, createUser } from '../services';

interface DepartmentItem {
  id: number; name: string; 
}

interface Departments extends Array<DepartmentItem>{}

interface FieldsErrors {
  name: boolean,
  dateOfBirth: boolean,
  email: boolean,
  terms: boolean,
  department: boolean,
}


export const Form = () => {
  const nameRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const dateOfBirthRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const emailRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [departments, setDepartments] = useState<Departments>([])
  const [selectedDepartment, setSelectedDepartment] = useState<number | undefined>(undefined)
  const [isTermsChecked, setIsTermsChecked] = useState<boolean>(false)
  const [fieldErrors, setFieldErrors] = useState<FieldsErrors>({
    name: false,
    dateOfBirth: false,
    email: false,
    terms: false,
    department: false
  })
  const [isSuccessful, setIsSuccessful] = useState<boolean>(false)

  useEffect(() => {
    loadSelectValues()
  }, [])

  const loadSelectValues = async() => {
    await fetchDepartment(setDepartments, setError)
    setIsLoading(false)
  }

  const handleSubmit = async(e: any) => {
    e.preventDefault()
    const name = nameRef?.current?.value;
    const date = dateOfBirthRef?.current?.value;
    const email = emailRef?.current?.value;

    if(!name || !date || !email || !isTermsChecked || !selectedDepartment) {
     return  setFieldErrors({
        name: name.length <= 0,
        dateOfBirth: date.length <= 0,
        email: email.length <= 0,
        terms: isTermsChecked ? false : true,
        department: selectedDepartment ? false : true,
      })
    }
    setFieldErrors({
      name: false,
      dateOfBirth: false,
      email: false,
      terms: false,
      department: false
    })

    const payload = {
      name, date, email, selectedDepartment
    }

    setIsSubmitting(true)
    await createUser(payload, setIsSuccessful, setError)
    setIsSubmitting(false)
  };

  const renderSubmitButton = () => {
    if(isSubmitting) {
      return (
<div className="spinner-border" role="status"></div>
      )
    }
    return (
      <button type="submit" className="btn btn-primary">
      Zapisz
    </button>
    )
  }

  const renderDepartmentOptions = () => {
 
      return (
        <select value={selectedDepartment} onChange={e => setSelectedDepartment(Number(e.target.value))} className="form-select" name="department" id="user-department">
          <option value={undefined}>Wybierz</option>
          {departments?.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        )


  }

  const renderError = (fieldError: boolean) => {
    if(fieldError) {
      return (
        <p className='small text-danger'>
        Wypełnij pole
      </p>
      )
    }
    return null
  }

  const renderInfo = () => {
    if(isSuccessful) {
      return (
        <p className='text-success'>
        Dane zostały poprawnie zapisane
      </p>
      )
    }

    else if(error) {
      return (
        <p className='text-danger'>
        {error}
      </p>
      )
    }
    return null
  }

if(!isLoading) {
  return (
    <form className="mt-5" onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="user-name" className="form-label">
          Imię i nazwisko
        </label>
        <input
          type="name"
          className="form-control"
          ref={nameRef}
          id="user-name"
          placeholder="Imię i nazwisko"
          name="fullName"
        />
        {renderError(fieldErrors?.name)}

      </div>
      <div className="mb-3">
        <label htmlFor="user-birth-date" className="form-label">
          Data urodzenia
        </label>
        <input
          type="text"
          className="form-control"
          ref={dateOfBirthRef}
          id="user-birth-date"
          placeholder="DD/MM/YYYY"
          name="birthDate"
        />
        {renderError(fieldErrors.dateOfBirth)}
      </div>
      <div className="mb-3">
        <label htmlFor="user-email" className="form-label">
          Email
        </label>
        <input
          type="email"
          className="form-control"
          ref={emailRef}
          id="user-email"
          placeholder="user@example.com"
          name="email"
        />
        {renderError(fieldErrors.email)}
      </div>
      <div className="mb-3">
      <label htmlFor="user-department" className="form-label">
          Wydział
        </label>
    {renderDepartmentOptions()}
    {renderError(fieldErrors.department)}
      </div>
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          onChange={() => setIsTermsChecked(!isTermsChecked)}
          id="form-terms"
          name="termsOfUse"
        />
        <label className="form-check-label" htmlFor="form-terms">
          Akceptuję regulamin
        </label>
        {renderError(fieldErrors?.terms)}
      </div>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
      {renderSubmitButton()}
      </div>
      {renderInfo()}
    </form>
  );
}
return (
<div className="spinner-border" role="status"></div>
)
};
