export function setFeedItems ( state, {feedItemsList, lastVisible, topic} ) {
  console.log(feedItemsList)
  state.feedItemsLists = [feedItemsList]
  state.lastVisible = lastVisible
  state.topic = topic
}

export function setNextFeedItems ( state, {feedItemsList, lastVisible} ) {
  state.feedItemsLists.push(feedItemsList);
  state.lastVisible = lastVisible
}

export function clearStateFeedItems ( state ) {
  state.feedItems = [];
}

export function setTopic (state, topic) {
  state.topic = topic;
}
