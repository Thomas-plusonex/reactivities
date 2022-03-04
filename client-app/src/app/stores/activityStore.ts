import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";

export default class ActivityStore {
  activityRegistry = new Map<string, Activity>();
  selectedActivity: Activity | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = false;

  constructor() {
    makeAutoObservable(this)
  }

  get activitiesByDate() {
    return Array.from(this.activityRegistry.values())
      .sort((a, b) => 
        Date.parse(b.date) - Date.parse(a.date)
      );
  }

  get groupedActivities() {
    return Object.entries(
      this.activitiesByDate.reduce((activities, activity) => {
        const date = activity.date;
        activities[date] = activities[date] ? [...activities[date], activity] : [activity];
        return activities;
      }, {} as {[key: string]: Activity[]})
    )
  }

  loadActivities = async () => {
    try {
      this.setLoadingInitial(true);
      const acts = await agent.Activities.list();
      acts.forEach(activity => {
        this.setActivity(activity);
      })
    } catch (error) {
      console.error(error);
    } finally {
      this.setLoadingInitial(false);
    }
  }

  loadActivity = async (id: string) => {
    let activity = this.getActivity(id);

    if (activity) {
      this.selectedActivity = activity;
      return activity;
    } else {
      this.setLoadingInitial(true);
      try {
        activity = await agent.Activities.details(id);
        this.setActivity(activity);
        runInAction(() => {
          this.selectedActivity = activity;
        })
        return activity;
      } catch (error) {
        console.error(error);
      } finally {
        this.setLoadingInitial(false);
      }
    }
  }

  private getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  }

  private setActivity = (activity: Activity) => {
    activity.date = activity.date.split('T')[0];
    this.activityRegistry.set(
      activity.id,
      activity
    );
  }

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  }

  setLoading = (state: boolean) => {
    this.loading = state;
  }

  createActivity = async (activity: Activity) => {
    this.setLoading(true);
    try {
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activityRegistry.set(
          activity.id,
          activity
        );
        this.selectedActivity = activity;
        this.editMode = false;
      })
    } catch (error) {
      console.error(error);
    } finally {
      this.setLoading(false);
    }
  }

  updateActivity = async (activity: Activity) => {
    this.setLoading(true);
    
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        this.activityRegistry.set(
          activity.id,
          activity
        )
        this.selectedActivity = activity;
        this.editMode = false;
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.setLoading(false);
    }
  }

  deleteActivity = async (id: string) => {
    this.setLoading(true);

    try {
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activityRegistry.delete(id);
        this.selectedActivity = undefined;
        this.editMode = false;
      })
    } catch (error) {
      console.error(error);
    } finally {
      this.setLoading(false);
    }
  }
}