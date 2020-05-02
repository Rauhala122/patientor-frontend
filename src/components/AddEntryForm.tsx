import React, {useState} from "react"
import {DiagnosisSelection} from '../AddPatientModal/FormField'
import { ErrorMessage, Form, Field, FieldProps, FormikProps, Formik } from "formik";
import { Grid, Button } from "semantic-ui-react";
import { useStateValue } from "../state";
import {TextField, NumberField, TypeSelectField, SelectField, GenderOption} from '../AddPatientModal/FormField'
import { Dropdown, DropdownProps } from "semantic-ui-react";
import { Entry, EntryType, Gender } from "../types";

type EntryFormValues = Omit<Entry, "id">;

export type TypeOption = {
  value: EntryType;
  label: string;
};

interface Props {
  onSubmit: (values: EntryFormValues) => void
  onCancel: () => void
}

const typeOptions: TypeOption[] = [
  { value: EntryType.HospitalEntry, label: "Hospital" },
  { value: EntryType.OccupationalHealthcareEntry, label: "Occupational Healthcare" },
  { value: EntryType.HealthCheckEntry, label: "Health Check" }
];

const AddEntryForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const [{ diagnoses }] = useStateValue()
  const [type, setType] = useState("Hospital")
  const [dischargeDate, setDischargeDate] = useState("")
  const [criteria, setCriteria] = useState("")

  const changeType = (e: React.FormEvent<EventTarget>) => {
    if (e) {
      setType(e.target.value)
      console.log(e.target.value)
    }
  }

  const renderSpecialFields = () => {
    switch (type) {
      case "Hospital":
        return (
          <div>
            <h2>Discharge</h2>
            <Field
              label="Date"
              placeholder="YYYY-MM-DD"
              name="discharge.date"
              component={TextField}
            />

            <Field
              label="Criteria"
              placeholder="Criteria"
              name="discharge.criteria"
              component={TextField}
            />
          </div>
        )
      case "OccupationalHealthcare":
          return (
            <div>
              <Field
                label="Employer Name"
                placeholder="Employer name"
                name="employerName"
                component={TextField}
              />
              <h2>Sick leave</h2>

              <Field
                label="Start Date"
                placeholder="YYYY-MM-DD"
                name="sickLeave.startDate"
                component={TextField}
              />

              <Field
                label="End Date"
                placeholder="YYYY-MM-DD"
                name="sickLeave.endDate"
                component={TextField}
              />
            </div>
          )
      case "HealthCheck":
        return (
          <div>
            <Field
              label="healthCheckRating"
              name="healthCheckRating"
              component={NumberField}
              min={0}
              max={3}
            />
          </div>
        )
      default:
        return "SAska"
    }
  }

  return (
    <Formik
    enableReinitialize
    initialValues={{
      type: type,
      description: "",
      date: "",
      specialist: "",
      diagnosisCodes: [],
      discharge: {
        date: "",
        criteria: ""
      },
      sickLeave: {
        startDate: "",
        endDate: ""
      },
      employerName: "",
      healthCheckRating: 0
    }}
    onSubmit={onSubmit}
    validate={values => {
      const requiredError = "Field is required";
      const errors: { [field: string]: string } = {};
      if (!values.description) {
        errors.description = requiredError;
      }
      if (!values.date) {
        errors.date = requiredError;
      }
      if (!values.specialist) {
        errors.specialist = requiredError;
      }
      if (type === "OccupationalHealthcare") {
        if (!values.employerName) {
          errors.employerName = requiredError;
        }
      }
      if (type === "HealthCheck") {
        if (!values.healthCheckRating) {
          errors.healthCheckRating = requiredError;
        }
      }
      if (type === "Hospital") {
        if (!values.discharge.date) {
          errors.dischargeDate = requiredError;
        }
        if (!values.discharge.criteria) {
          errors.criteria = requiredError;
        }
      }

      return errors;
    }}
  >

    {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
      return (
        <Form className="form ui">
            <TypeSelectField
              label="Type"
              name="type"
              options={typeOptions}
              onChange={changeType}
              value={type}
            />

            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <Field
              label="Date"
              placeholder="YYYY-MM-DD"
              name="date"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />

          <DiagnosisSelection
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            diagnoses={Object.values(diagnoses)}
          />

          {renderSpecialFields()}

          <Grid>
            <Grid.Column floated="left" width={5}>
              <Button type="button" onClick={onCancel} color="red">
                Cancel
              </Button>
            </Grid.Column>
            <Grid.Column floated="right" width={5}>
              <Button
                type="submit"
                floated="right"
                color="green"
                disabled={!dirty || !isValid}
              >
                Add
              </Button>
            </Grid.Column>
          </Grid>

        </Form>
      );
    }}
  </Formik>
  );
};

export default AddEntryForm
