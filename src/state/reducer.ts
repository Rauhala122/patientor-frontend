import { State } from "./state";
import { Patient, Diagnosis, Entry } from "../types";

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    }

  | {
    type: "GET_PATIENT";
    patient: Patient
  }

  | {
    type: "SET_DIAGNOSES_LIST";
    payload: Diagnosis[]
  }

  | {
    type: "ADD_ENTRY";
    payload: Entry
  }

export const setPatientList = (patients: Patient[]): Action => {
  return {
      type: "SET_PATIENT_LIST",
      payload: patients
  }
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients
        }
      };

    case "SET_DIAGNOSES_LIST":
      return {
        ...state,
        diagnoses: {
          ...action.payload.map(diagnosis => diagnosis)
        },
        ...state.diagnoses
      }
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    case "GET_PATIENT":
      return {
        ...state,
        patient: action.patient
      }

    case "ADD_ENTRY":
      if (state.patient) {
        console.log("Entry in reducer", action.payload)
        const newPatient: Patient = {
          ...state.patient,
          entries: state.patient ? state.patient.entries.concat(action.payload) : []
        }
        console.log("New patient: ", newPatient)
        return {
          ...state,
          patient: newPatient,
          patients: {
            ...state.patients
          }
        }
      }
      console.log("Patient not found in state")
    default:
      return state;
  }
};
