import { createSelector } from 'reselect'

import { RootState } from 'modules/common/types'
import { ComponentDefinition, ComponentType } from 'modules/scene/types'
import { getComponentsByType, getEntityComponentByType } from 'modules/scene/selectors'
import { LoadingState } from 'decentraland-dapps/dist/modules/loading/reducer'
import { getCurrentProject, getLoading as getLoadingProject } from 'modules/project/selectors'
import { getLoading as getLoadingAuth } from 'modules/auth/selectors'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { LOAD_MANIFEST_REQUEST } from 'modules/project/actions'
import { Project } from 'modules/project/types'
import { AUTH_REQUEST } from 'modules/auth/actions'

export const getState = (state: RootState) => state.editor
export const getGizmo = (state: RootState) => getState(state).gizmo
export const isSidebarOpen = (state: RootState) => getState(state).sidebar
export const isPreviewing = (state: RootState) => getState(state).preview
export const isSnapToGridEnabled = (state: RootState) => getState(state).snapToGrid
export const getSelectedEntityId = (state: RootState) => getState(state).selectedEntityId
export const isReady = (state: RootState) => getState(state).isReady
export const isLoading = (state: RootState) => getState(state).isLoading
export const getEntitiesOutOfBoundaries = (state: RootState) => getState(state).entitiesOutOfBoundaries
export const areEntitiesOutOfBoundaries = (state: RootState) => getState(state).entitiesOutOfBoundaries.length > 0
export const getSceneMappings = createSelector<RootState, ComponentDefinition<ComponentType.GLTFShape>[], Record<string, string>>(
  getComponentsByType<ComponentType.GLTFShape>(ComponentType.GLTFShape),
  components =>
    components.reduce<Record<string, string>>(
      (mappings, component) => ({
        ...mappings,
        ...component.data.mappings
      }),
      {}
    )
)
export const getEnabledTools = (selectedEntityId: string | null) =>
  createSelector<RootState, ComponentDefinition<ComponentType.NFTShape> | null, any>(
    getEntityComponentByType(selectedEntityId, ComponentType.NFTShape),
    nftShape => {
      const isNFT = !!nftShape
      return {
        move: !!selectedEntityId,
        rotate: !!selectedEntityId,
        duplicate: !!selectedEntityId && !isNFT,
        reset: !!selectedEntityId,
        delete: !!selectedEntityId
      }
    }
  )

export const isFetching = createSelector<RootState, Project | null, boolean, LoadingState, LoadingState, boolean>(
  getCurrentProject,
  isReady,
  getLoadingProject,
  getLoadingAuth,
  (project, _ready, loadingProject, loadingAuth) => {
    if (project) {
      return false
    } else if (isLoadingType(loadingProject, LOAD_MANIFEST_REQUEST)) {
      return true
    } else if (isLoadingType(loadingAuth, AUTH_REQUEST)) {
      return true
    }
    return false
  }
)
