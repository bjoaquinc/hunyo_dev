import { uid } from "quasar";

export function setCreateId (state) {
  const createId = uid();
  state.createId = createId
  return createId;
}

export function setFirstTimestamp (state) {
  const timestamp = Date.now();
  state.firstTimestamp = timestamp;
  return;
}

export function clearState(state) {
  state.createId = '';
  state.firstTimestamp = 0;
}
