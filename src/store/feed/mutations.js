export function setFeedItems ( state, feedItemsList ) {
  state.feedItems = feedItemsList
}

export function setRecommendID ( state, recommendId ) {
  state.recommendId = recommendId
}

export function clearStateFeedItems ( state ) {
  state.feedItems = [];
}

export function clearStateRecommendationItem ( state ) {
  state.recommendId = '';
}