import { createSelector } from 'reselect'
import { RootState } from 'modules/common/types'
import { ProjectState } from 'modules/project/reducer'
import { getProjectId } from 'modules/location/selectors'
import { Project } from 'modules/project/types'

export const getState: (state: RootState) => ProjectState = state => state.project

export const getData: (state: RootState) => ProjectState['data'] = state => getState(state).data

export const isLoading: (state: RootState) => boolean = state => getState(state).loading.length > 0

export const getError: (state: RootState) => ProjectState['error'] = state => getState(state).error

export const getCurrentProject = createSelector<RootState, string | undefined, ProjectState['data'], Project>(
  getProjectId,
  getData,
  (projectId, projects) => projects[projectId!]
)
