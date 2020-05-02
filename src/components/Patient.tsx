import React from 'react';
import axios from "axios";
import { Icon } from 'semantic-ui-react';
import {Patient, Diagnosis, Entry, Discharge} from '../types'
import { useStateValue } from "../state";
import { useParams } from "react-router";
import { apiBaseUrl } from "../constants";
import AddEntryForm from './AddEntryForm'

import EntryPage from "./Entry"

export type EntryFormValues = Omit<Entry, "id" >;

const PatientPage = () => {

  const {id} = useParams<{id: string}>()

  const [{patient}, dispatch] = useStateValue();

  const [{diagnoses}] = useStateValue();

  React.useEffect(() => {
    axios.get<void>(`${apiBaseUrl}/patients/${id}`);

    const fetchPatient = async () => {
      try {
        const { data: patientFromApi } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        console.log(patientFromApi)
        dispatch({type: "GET_PATIENT", patient: patientFromApi})
      } catch (e) {
        console.error(e);
      }
    };
    fetchPatient();
  }, [dispatch]);

  React.useEffect(() => {
    axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchDiagnosisList = async () => {
      try {
        const { data: diagnosisListFromApi } = await axios.get<Diagnosis[]>(
          `${apiBaseUrl}/diagnoses`
        );
        // dispatch({ type: "SET_PATIENT_LIST", payload: patientListFromApi });
        dispatch({type: "SET_DIAGNOSES_LIST", payload: diagnosisListFromApi})
      } catch (e) {
        console.error(e);
      }
    };
    fetchDiagnosisList();
  }, [dispatch]);

  const getDiagnosisName = (code: string) => {
    const diagnosis = Object.values(diagnoses).find(diagnosis => diagnosis.code === code)

    if (diagnosis) {
      return (
        diagnosis.name
      )
    } else {
      return ""
    }
  }

  const submitNewEntry = async (values: EntryFormValues) => {
    console.log(values)
    try {
      const { data: newEntry } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${id}/entries`,
        {...values, discharge: {
          dischargeDate: "",
          criteria: ""
        }}
      );
      console.log("New entry: ", newEntry)
      dispatch({ type: "ADD_ENTRY", payload: newEntry});
      console.log("New entry")
    } catch (e) {
      console.error(e.response.data);
      // setError(e.response.data.error);
    }
  };

  // const patient = props.patients.find(patient => patient.id === id)
  if (patient) {
    return (
      <div>
        <h1>{patient.name} <Icon name={patient.gender === "male" ? "male" : "female"}/></h1>
        <p> ssn: {patient.ssn}</p>
        <p> occupation: {patient.occupation}</p>

        <h2>Entries</h2>
        {patient.entries.map(entry =>
          <div>
            <EntryPage entry={entry}/>
          </div>
        )}

        <h2>Add new entry</h2>
        <AddEntryForm onSubmit={submitNewEntry} onCancel={() => console.log("form canceled")}/>
      </div>
    )
  }

  return <p>Patient not found</p>
}

export default PatientPage
