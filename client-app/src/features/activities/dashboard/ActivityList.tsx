import React, {SyntheticEvent, useState} from "react";
import {Button, Item, Label, Segment} from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";

function ActivityList() {
  const {
    activityStore
  } = useStore();

  const {
    deleteActivity,
    loading,
    activitiesByDate
  } = activityStore;

  const [target, setTarget] = useState('');
  function handleActivityDelete(e: SyntheticEvent<HTMLButtonElement>, id: string) {
    setTarget(e.currentTarget.name);
    deleteActivity(id);
  }

  return (
    <Segment>
      <Item.Group divided>
        {
          activitiesByDate.map(a => (
            <Item key={a.id}>
              <Item.Content>
                <Item.Header as='a'>{a.title}</Item.Header>
                <Item.Meta>{a.date}</Item.Meta>
                <Item.Description>
                  <div>{a.description}</div>
                  <div>{a.city}, {a.venue}</div>
                </Item.Description>
                <Item.Extra>
                  <Button floated='right' content='View' color='blue' as={Link} to={`/activities/${a.id}`}/>
                  <Button name={a.id} floated='right' content='Delete' color='red' onClick={(e) => handleActivityDelete(e, a.id)} loading={loading && target===a.id}/>
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

export default observer(ActivityList);