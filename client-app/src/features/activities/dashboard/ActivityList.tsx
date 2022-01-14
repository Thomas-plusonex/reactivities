import React, {SyntheticEvent, useState} from "react";
import {Activity} from "../../../app/models/activity";
import {Button, Item, Label, Segment} from "semantic-ui-react";

interface Props {
  activities: Activity[],
  selectActivity: (id: string) => void,
  deleteActivity: (id: string) => void,
  submitting: boolean
}

export default function ActivityList(props: Props) {
  const {
    activities,
    submitting,
    selectActivity,
    deleteActivity
  } = props;

  const [target, setTarget] = useState('');
  function handleActivityDelete(e: SyntheticEvent<HTMLButtonElement>, id: string) {
    setTarget(e.currentTarget.name);
    deleteActivity(id);
  }

  return (
    <Segment>
      <Item.Group divided>
        {
          activities.map(a => (
            <Item key={a.id}>
              <Item.Content>
                <Item.Header as='a'>{a.title}</Item.Header>
                <Item.Meta>{a.date}</Item.Meta>
                <Item.Description>
                  <div>{a.description}</div>
                  <div>{a.city}, {a.venue}</div>
                </Item.Description>
                <Item.Extra>
                  <Button floated='right' content='View' color='blue' onClick={() => selectActivity(a.id)}/>
                  <Button name={a.id} floated='right' content='Delete' color='red' onClick={(e) => handleActivityDelete(e, a.id)} loading={submitting && target===a.id}/>
                  <Label basic content={a.category}/>
                </Item.Extra>
              </Item.Content>
            </Item>
          ))
        }
      </Item.Group>
    </Segment>
  )
}