import React, { useMemo, useCallback } from 'react'
import { Network } from '@dcl/schemas'
import { NetworkButton } from 'decentraland-dapps/dist/containers'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { SyncStatus } from 'modules/item/types'
import { isStatusAllowedToPushChanges } from 'modules/item/utils'
import { CurationStatus } from 'modules/curations/types'
import UnderReview from './UnderReview'
import { Props, PublishButtonAction } from './CollectionPublishButton.types'

export const getTPButtonActionLabel = (buttonAction: PublishButtonAction) => {
  switch (buttonAction) {
    case PublishButtonAction.PUSH_CHANGES:
      return t('third_party_collection_detail_page.push_changes')
    case PublishButtonAction.PUBLISH_AND_PUSH_CHANGES:
      return t('third_party_collection_detail_page.publish_and_push_changes')
    default:
      return t('third_party_collection_detail_page.publish')
  }
}

const CollectionPublishButton = (props: Props) => {
  const { collection, items, slots, onClick, itemsStatus, itemCurations, isLoadingItemCurations } = props

  const buttonAction = useMemo(() => {
    let action = PublishButtonAction.PUBLISH
    const { willPublish, willPushChanges } = Object.values(itemsStatus).reduce(
      (acc, status) => {
        if (status === SyncStatus.UNPUBLISHED) {
          acc.willPublish = true
        } else if (isStatusAllowedToPushChanges(status)) {
          acc.willPushChanges = true
        }
        return acc
      },
      {
        willPublish: false,
        willPushChanges: false
      }
    )
    const isJustPushingChanges = willPushChanges && !willPublish
    const isPublishingAndPushing = willPushChanges && willPublish
    if (isJustPushingChanges) {
      action = PublishButtonAction.PUSH_CHANGES
    } else if (isPublishingAndPushing) {
      action = PublishButtonAction.PUBLISH_AND_PUSH_CHANGES
    }
    return action
  }, [itemsStatus])

  const handleOnClick = useCallback(() => {
    const itemIds = items.map(item => item.id)
    onClick(collection.id, itemIds, buttonAction)
  }, [collection, items, buttonAction])

  const hasPendingItemCurations = itemCurations && !!itemCurations.find(ic => ic.status === CurationStatus.PENDING)
  const isTryingToPublish = [PublishButtonAction.PUBLISH, PublishButtonAction.PUBLISH_AND_PUSH_CHANGES].includes(buttonAction)

  return !isLoadingItemCurations && isTryingToPublish && hasPendingItemCurations ? (
    <UnderReview type="publish" />
  ) : (
    <NetworkButton
      loading={isLoadingItemCurations}
      disabled={slots === 0 || items.length === 0}
      primary
      compact
      onClick={handleOnClick}
      network={Network.MATIC}
    >
      {getTPButtonActionLabel(buttonAction)}
    </NetworkButton>
  )
}

export default React.memo(CollectionPublishButton)
