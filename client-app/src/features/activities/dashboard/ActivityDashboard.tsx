import React from "react";
import {Grid} from "semantic-ui-react";
import {Activity} from "../../../app/models/activity";
import ActivityList from "./ActivityList";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";

interface DashboardProps {
  activities: Activity[],
  selectedActivity: Activity | undefined,
  selectActivity: (id: string) => void,
  cancelSelectedActivity: () => void,
  editMode: boolean,
  openForm: (id: string) => void,
  closeForm: () => void,
  createOrEditActivity: (activity: Activity) => void,
  deleteActivity: (id: string) => void
}

export default function ActivityDashboard(props: DashboardProps) {
  const {
    activities,
    selectActivity,
    selectedActivity,
    cancelSelectedActivity,
    editMode,
    openForm,
    closeForm,
    createOrEditActivity,
    deleteActivity
  } = props;

  return (
    <Grid>
      <Grid.Column width='10'>
        <ActivityList activities={activities} selectActivity={selectActivity} deleteActivity={deleteActivity}/>
      </Grid.Column>
      <Grid.Column width={'6'}>
        {
          (selectedActivity && !editMode) &&
            <ActivityDetails activity={selectedActivity} cancelSelectedActivity={cancelSelectedActivity} openForm={openForm}/>
        }
        {
          editMode &&
            <ActivityForm createOrEditActivity={createOrEditActivity} activity={selectedActivity} closeForm={closeForm}/>
        }
      </Grid.Column>
    </Grid>
  )
}