import React from 'react';
import { Icon } from 'semantic-ui-react';
import {Entry} from '../types'

interface EntryProps {
  entry: Entry;
}

const assertNever = (value: Entry): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const EntryPage: React.FC<EntryProps> = (props) => {
  const entryStyle = {
    marginTop: 20,
    border: 1,
    borderRadius: 7.5,
    borderColor: "grey",
    borderStyle: "solid",
    padding: 10
  }

  const entry = props.entry

  if (entry) {
    const renderEntryIcon = () => {
      switch (entry.type) {
        case "OccupationalHealthcare":
          return <Icon name="stethoscope"/>
        case "Hospital":
          return <Icon name="hospital"/>
        case "HealthCheck":
          return <Icon name="user md"/>
        default:
          assertNever(entry)
      }
    }

    const renderHealthRating = () => {
      if (entry.type === "HealthCheck") {
        switch (entry.healthCheckRating) {
          case 0:
            return <Icon name="heart" color="green"/>
          case 1:
            return <Icon name="heart" color="yellow"/>
          case 2:
            return <Icon name="heart" color="red"/>
          case 3:
            return <Icon name="heart" color="black"/>
          default:
            return ""
        }
      }
    }

      return (
        <div style={entryStyle}>
          <h2>{entry.date} {renderEntryIcon()} {entry.type === "OccupationalHealthcare" ? entry.employerName : ""}</h2>
          <p><i>{entry.description}</i></p>
          <p>{renderHealthRating()}</p>
        </div>
      )
  } else {
    return (
      <p>No Entry</p>
    )
  }

}

export default EntryPage
